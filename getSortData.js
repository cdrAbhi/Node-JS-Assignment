// Convert degrees to radians
function toRad(degree) {
    return degree * (Math.PI / 180);
  }
  
  // Calculate distance using the Haversine formula
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;  // Earth radius in kilometers
    const deltaLat = toRad(lat2 - lat1);
    const deltaLon = toRad(lon2 - lon1);
    
    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
              Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;  // Distance in kilometers
  }
  
  // Sort schools by proximity to the user
  function sortSchoolsByProximity(userLocation, schools) {
    return schools.map(school => {
      const distance = calculateDistance(userLocation.latitude, userLocation.longitude, school.latitude, school.longitude);
      return { ...school, distance };
    })
    .sort((a, b) => a.distance - b.distance);  // Sort by distance
  }
  
  module.exports = { sortSchoolsByProximity };
  