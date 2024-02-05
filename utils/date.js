function formatDate(date) {
    const options = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      day: 'numeric',
      weekday: 'long',
    };
  
    const formattedDate = new Date(date || Date.now()).toLocaleString('en-US', options);
    return formattedDate;
};

module.exports = formatDate