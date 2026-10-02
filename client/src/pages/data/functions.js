export const getTaskRewards = (task) => {
    if (!task.limit_date || task.finished_date || !task.delay_bonus || (task.label && (task.label==='Maddy' || task.label==='Mathis'))) return [task.reward,task.reward,0];
    const days = Math.round((new Date().setHours(0,0,0,0)-new Date(task.limit_date).setHours(0,0,0,0))/86400000);
    return [task.reward,days>0?task.reward+Math.min(days*5,100):task.reward,days>0?Math.min(days*5,100):0];
    // [0] = base reward only // [1] = base reward + bonus // [2] = bonus only
}

export const dateValue = (date) => {
    const dateObj = date?new Date(date):new Date();
    return dateObj.getFullYear()*10000+dateObj.getMonth()*100+dateObj.getDate();
}