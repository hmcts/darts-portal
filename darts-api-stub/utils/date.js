const getLatestDatefromKey = (array, key = 'retention_last_changed_date') => {
  const latest = array.reduce((max, item) => (new Date(item[key]) > new Date(max[key]) ? item : max), array[0]);
  return latest;
};

const getEarliestDatefromKey = (array, key = 'retention_last_changed_date') => {
  const latest = array.reduce((max, item) => (new Date(item[key]) < new Date(max[key]) ? item : max), array[0]);
  return latest;
};

module.exports = { getLatestDatefromKey, getEarliestDatefromKey };
