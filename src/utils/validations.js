function getDatefromDate(date) {
    // Formatear la date en MM-DD-YYYY
    const month = date.getMonth() + 1; // Los monthes en Date comienzan desde 0
    const day = date.getDate();
    const year = date.getFullYear();
    return `${String(month).padStart(2, '0')} - ${String(day).padStart(2, '0')} - ${year}`;
  
  }

module.exports={
    getDatefromDate
}