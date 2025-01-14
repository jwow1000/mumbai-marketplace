export function getInfo() {
  
  // get the cms data from the webflow page collections item
  const infoItems = document.querySelectorAll('.cms-body-text');
  // console.log("i", infoItems);
  
  // Initialize an array to hold all the stories
  const allInfo = [];

  // Loop through each script tag and parse the JSON data
  infoItems.forEach( item => {
    // make an object with the data
    const obj = {
      title: item.getAttribute('data-title'),
      body: item.getAttribute('data-body'),
      tags: item.getAttribute('data-tags'),
      idMatch: item.getAttribute('data-idMatch'),
      img: item.getAttribute('data-img'),
      selectMatch: item.getAttribute('data-selectMatch'),
    } 
    
    // add the object to the allInfo array
    allInfo.push( obj );
  });

  // return the array
  return allInfo
}

