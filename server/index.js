require('dotenv').config();

const path = require('path');
const express = require("express");
const pool = require('./db');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../client/build')));

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');
const { log } = require('console');
const OpenAI = require('openai');

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDKEY,
  api_secret: process.env.CLOUDSECRET,
});

// Multer en mémoire (pas besoin de disque)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 Mo max
});

// Fonction utilitaire pour uploader depuis un buffer
const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'cocktails' },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });
};

app.post('/cocktailimage', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image provided.' });

    // Upload vers Cloudinary
    const result = await streamUpload(req.file.buffer);

    // Retourne l'URL Cloudinary
    res.status(200).json({
      message: 'Image uploaded successfully.',
      url: result.secure_url
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Image upload failed.', error: err.message });
  }
});

// Open AI Config
const openai = new OpenAI({
  apiKey: process.env.OPENAIKEY
});

app.post('/airequest', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        message: 'No message provided.'
      });
    }

    const response = await openai.responses.create({
      model: 'gpt-5.6-luna',
      instructions: `
        Tu es un système d'organisation, analyse le message de l'utilisateur.
        Pour information, nous sommes le 13/09/2026 à Lille.
        Ce système est utilisé par deux colocataires, Maddy et Mathis.
        Fais attention, dans le message, tu verras peut-être écrit "Maddie", "Mahdi" ou "m'as dit" au lieu de "Maddy" du fait de la reconnaissance vocale qui ne connais pas ce prénom.

        Si la commande concerne :
        - L'ajout d'une tâche :
          type = "createtask"
          title = le nom de la tâche très concis en moins de 3 mots et toujours avec une majuscule au début (n'hésite pas à utiliser des abréviations)
          description = la description de la tâche (n'invente pas de détails inutiles ou non demandés) (pas obligatoire)
          value = le nombre de points gagnés en terminant cette tâche entre 1 et 1000 : à toi de juger le gain s'il n'est pas donné, en fonction des contraintes de la tâche. au plus la tâche est difficile et chronophage, au plus elle rapporte de points.
          date = la date limite de la tâche en format AAAA-MM-JJ (pas obligatoire)
        
        - Le changement d'état d'une tâche :
          type = "updatetask"
          title = le nom de la tâche très concis en moins de 3 mots et toujours avec une majuscule au début (n'hésite pas à utiliser des abréviations)
          value = l'état de la tâche : 0 pour "à faire", 1 pour "prochaine tâche", 2 pour "terminée"
        
        - La suppression d'une tâche (seulement si l'idée de suppression est bien explicite, pas si la tâche est simplement terminée) :
          type = "deletetask"
          title = le nom de la tâche donné mot pour mot avec une majuscule au début
        
        - L'ajout d'un produit à acheter sur la liste de courses
          type = "createpurchase"
          title = le nom du produit à acheter avec une majuscule au début
          value = la liste de courses si elle est précisée : 0 pour la liste "commune" ou si rien n'est précisé, 1 pour la liste de "Maddy", 2 pour la liste de "Mathis"

        - Le changement de liste de courses d'un produit
          type = "updatepurchase"
          title = le nom du produit mot pour mot avec une majuscule au début
          value = la liste en question : 0 pour la liste "commune", 1 pour la liste de "Maddy", 2 pour la liste de "Mathis"

        - La suppression ou l'achat d'un produit de la liste de courses (acheter le produit = le supprimer de la liste)
          type = "deletepurchase"
          title = le nom du produit mot pour mot avec une majuscule au début

        Si la commande correspond à l'un des points mais qu'il te manque une information : type = "missinginfo"
        Sinon : type = "error"
        `,
      input: message,
      text: {
        format: {
          type: "json_schema",
          name: "organisation",
          strict: true,
          schema: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: ["createtask","updatetask","deletetask","createpurchase","updatepurchase","deletepurchase","missinginfo","error"]
              },
              title: {
                type: ["string", "null"]
              },
              description: {
                type: ["string", "null"]
              },
              value: {
                type: ["string", "null"]
              },
              date: {
                type: ["string", "null"]
              }
            },
            required: ["type","title","description","value","date"],
            additionalProperties: false
          }
        }
      }
    });

    const command = JSON.parse(response.output_text);

    if (command) {
      /* TACHES */
      if (command.type == "createtask") {
        try {
          const result = await pool.query(`INSERT INTO task (title,description,reward,limit_date) VALUES ($1,$2,$3,$4) RETURNING *;`,[command.title,command.description,parseInt(command.value),command.date]);
          if (result.rows.length === 0) return res.status(500).json({ message: 'Error while creating new task.' });
          res.json(result.rows[0]);
        } catch (err) {
          console.error(err.message);
          res.status(500).send('Server Error');
        }
      } else if (command.type == "updatetask") {
        try {
          const result = await pool.query(`UPDATE task SET state = $1 WHERE title = $2 RETURNING *;`,[command.value,command.title]);
          if (result.rows.length === 0) return res.status(500).json({ message: 'Error while updating task.' });
          res.json(result.rows[0]);
        } catch (err) {
          console.error(err.message);
          res.status(500).send('Server Error');
        }
      } else if (command.type == "deletetask") {
        try {
          const result = await pool.query(`DELETE FROM task WHERE title = $1 RETURNING *;`,[command.title]);
          if (result.rows.length === 0) return res.status(500).json({ message: 'Error while deleting task.' });
          res.json(result.rows[0]);
        } catch (err) {
          console.error(err.message);
          res.status(500).send('Server Error');
        }
      /* LISTE DE COURSES */
      } else if (command.type == "createpurchase") {
        try {
          const result = await pool.query(`INSERT INTO purchase (title,list) VALUES ($1,$2) RETURNING *;`,[command.title,parseInt(command.value)]);
          if (result.rows.length === 0) return res.status(500).json({ message: 'Error while creating new purchase.' });
          res.json(result.rows[0]);
        } catch (err) {
          console.error(err.message);
          res.status(500).send('Server Error');
        }
      } else if (command.type == "updatepurchase") {
        try {
          const result = await pool.query(`UPDATE purchase SET list = $1 WHERE title = $2 RETURNING *;`,[command.value,command.title]);
          if (result.rows.length === 0) return res.status(500).json({ message: 'Error while updating purchase.' });
          res.json(result.rows[0]);
        } catch (err) {
          console.error(err.message);
          res.status(500).send('Server Error');
        }
      } else if (command.type == "deletepurchase") {
        try {
          const result = await pool.query(`DELETE FROM purchase WHERE title = $1 RETURNING *;`,[command.title]);
          if (result.rows.length === 0) return res.status(500).json({ message: 'Error while deleting purchase.' });
          res.json(result.rows[0]);
        } catch (err) {
          console.error(err.message);
          res.status(500).send('Server Error');
        }
      }
    } else {
      res.status(200).json({command: command});
    }

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: 'OpenAI request failed.',
      error: err.message
    });
  }
});

app.post('/newuser', async (req, res) => {
  try {
    const { username } = req.body;

    const result = await pool.query(`INSERT INTO "user" (name) VALUES ($1) RETURNING *;`,[username]);

    if (result.rows.length === 0) {
      return res.status(500).json({ message: 'Error with the newuser request.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Global Data
app.get('/globaldata', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM globaldata');

    const data = result.rows;

    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/globaldata', async (req, res) => {
  try {
    const { key, type, value } = req.body;

    const allowedTypes = ['date'];
    if (!allowedTypes.includes(type)) return res.status(500).send('Type invalide');

    const result = await pool.query(`UPDATE globaldata SET ${type} = $1 WHERE key = $2 RETURNING *;`,[value, key]);
    const data = result.rows;
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/refreshtask', async (req, res) => {
  try {
    const refreshedTasks = await pool.query(`UPDATE task SET state = 1 WHERE limit_date <= CURRENT_DATE AND finished_date IS NULL RETURNING *;`);
    const deletedTasks = await pool.query(`DELETE FROM task WHERE finished_date < NOW() - INTERVAL '7 days' RETURNING *;`);
    const updatedData = await pool.query(`UPDATE globaldata SET date = CURRENT_DATE WHERE key = 'refreshtask' RETURNING *;`);
    res.json(updatedData.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Tasks
app.get('/task', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM task');

    const tasks = result.rows;

    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/task', async (req, res) => {
  try {
    const { taskId, title, description, reward, limitDate, period, label } = req.body;
    
    if (taskId === -1) {
      const result = await pool.query('INSERT INTO task (title,description,reward,limit_date,period,label) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;',[title,description,reward,limitDate,period,label]);
      const tasks = result.rows;
      res.json(tasks);
    } else {
      const result = await pool.query('UPDATE task SET title = $1, description = $2, reward = $3, limit_date = $4, period = $5, label = $6 WHERE id = $7 RETURNING *;',[title,description,reward,limitDate,period,label,taskId]);
      const tasks = result.rows;
      res.json(tasks);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/taskstate', async (req, res) => {
  try {
    const { taskId, state, winner, finishedDate, reward, totalReward } = req.body;
    const taskresult = await pool.query(`UPDATE task SET state = $1, winner = $2, finished_date = $3, reward = $4 WHERE id = $5 RETURNING *;`,[state,winner,finishedDate,state>=2?totalReward:reward,taskId])

    if (taskresult.rows.length === 0) return res.status(500).json({ message: 'Task not found.' });
    const task = taskresult.rows[0];

    if (state >= 2) {
      // Add to history
      const historyresult = await pool.query(`INSERT INTO taskhistory (title,reward,finished_date,winner,label) VALUES ($1,$2,$3,$4,$5) RETURNING *;`,[task.title,task.reward,finishedDate,winner,task.label]);
      if (historyresult.rows.length === 0) return res.status(500).json({ message: 'Error while creating task history.' });
      
      // Give reward
      const userresult = await pool.query(`UPDATE "user" SET points = points + $1 WHERE name = $2 RETURNING *;`,[task.reward,winner])
      if (userresult.rows.length === 0) return res.status(500).json({ message: 'User not found.' });

      // Duplicate periodic tasks
      if (!!task.limit_date && task.period > 0) {
        const newLimitDate = new Date();
        newLimitDate.setDate(newLimitDate.getDate() + task.period + 1);
        const newtaskresult = await pool.query('INSERT INTO task (title,description,reward,limit_date,period,label) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;',[task.title,task.description,reward,newLimitDate.toISOString(),task.period,task.label]);
        if (newtaskresult.rows.length === 0) return res.status(500).json({ message: 'Error while copying task.' });
      }
    }
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/deletetask', async (req, res) => {
  try {
    const { taskId } = req.body;
    const taskResult = await pool.query(`DELETE FROM task WHERE id = $1 RETURNING *;`,[taskId])

    if (taskResult.rows.length === 0) return res.status(500).json({ message: 'Task not found.' });

    res.json(taskResult.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/splittask', async (req, res) => {
  try {
    const { taskId, reward } = req.body;
    
    const task1result = await pool.query('UPDATE task SET reward = $1 WHERE id = $2 RETURNING *;',[Math.round(reward/2),taskId]);
    if (task1result.rows.length === 0) return res.status(500).json({ message: 'Task not found.' });
    const task1 = task1result.rows[0];

    const task2result = await pool.query('INSERT INTO task (title,description,reward,limit_date,period,state,label) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;',[task1.title,task1.description,Math.round(reward/2),task1.limit_date,task1.period,task1.state,task1.label]);
    if (task2result.length === 0) return res.status(500).json({ message: 'Error while copying task.' });

    res.json(task2result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Purchases
app.get('/purchase', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM purchase');

    const purchases = result.rows;

    res.json(purchases);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/purchase', async (req, res) => {
  try {
    const { purchaseId, title } = req.body;

    if (purchaseId === -1) {
      const result = await pool.query('INSERT INTO purchase (title) VALUES ($1) RETURNING *;',[title]);
      const purchases = result.rows;
      res.json(purchases);
    } else {
      const result = await pool.query('UPDATE purchase SET title = $1 WHERE id = $2 RETURNING *;',[title,purchaseId]);
      const purchases = result.rows;
      res.json(purchases);
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/purchaselist', async (req, res) => {
  try {
    const { purchaseId, list } = req.body;
    const purchaseResult = await pool.query(`UPDATE purchase SET list = $1 WHERE id = $2 RETURNING *;`,[list,purchaseId])

    if (purchaseResult.rows.length === 0) return res.status(500).json({ message: 'Purchase not found.' });

    res.json(purchaseResult.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/deletepurchase', async (req, res) => {
  try {
    const { purchaseId } = req.body;
    const purchaseResult = await pool.query(`DELETE FROM purchase WHERE id = $1 RETURNING *;`,[purchaseId])

    if (purchaseResult.rows.length === 0) return res.status(500).json({ message: 'Purchase not found.' });

    res.json(purchaseResult.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Users
app.get('/user', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "user"');

    const users = result.rows;

    /*for (const user of users) {
      const purchaseResult = await pool.query(`SELECT * FROM purchase p WHERE p.user_id = $1`, [user.id]);
      user.purchases = purchaseResult.rows;
    }*/

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// General

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});