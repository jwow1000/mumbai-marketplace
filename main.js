window.addEventListener("DOMContentLoaded", () => {
  const svg = document.querySelectorAll(".button");
  
  // get the blur image
  const blurLayer = document.querySelectorAll(".svg-blur-image");


  // detect when mouse is over item
  svg.forEach((element) => {
    console.log("look at the e", element.id)
    
    
    element.addEventListener("mouseover", () => {
      // console.log(`mouse over: ${element.id} `);
      
      // get the id and replace the mask url
      blurLayer.forEach((e) => {
        // console.log("hmmm",`url(#${element.id})` )
        e.setAttribute('mask', `url(#mask-${element.id})`);
      });
      
      // make the blur layer visible, with an ease animation in css
      blurLayer.forEach((e) => {
        e.style.opacity = "100";
      });
    });
    
    element.addEventListener("mouseout", () => {
      // console.log(`mouse off: ${element.id}`);
      
      // make the blur layer dissapear with an eas out in css
      blurLayer.forEach((e) => {
        e.style.opacity = "0";
      });
    });

  });
  

  
});








