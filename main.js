import { getInfo } from "./helpers/fetch";
import * as d3 from 'd3';

const overlay = 'https://cdn.prod.website-files.com/66c4bc9a1e606660c92d9d24/66d5b8ff4aaadc8d13ce8c78_interact.svg';

  
d3.xml( overlay )
  .then(data => {
    const svg = data.documentElement;
    svg.id = "overlay-item"; // Assign an ID or any attributes you need
    
    // get the info
    const info = getInfo();
    console.log("chweck it out: ", info);
    
    // add the svg to the DOM
    const svgContainer = document.querySelector(".svg-container-mplace");
    console.log("the webflow container", svgContainer);
    svgContainer.appendChild( svg );
    
    // then add the event listeners
    // detect when mouse is over item
    
    
  })
  
  .then( data => {
    const svg = document.body.querySelector("#overlay-item");

    // get the buttons
    const buttons = svg.querySelectorAll(".button");

    // get the blur image
    const blurLayer = svg.querySelectorAll(".svg-blur-image");
    // console.log("buttons", blurLayer)
    

    buttons.forEach((element) => {
      console.log("look at the e", element.id)
      
      element.addEventListener("mouseover", () => {
        // console.log(`mouse over: ${element.id} `);
        
        // get the id and replace the mask url
        blurLayer.forEach((e) => {
          console.log("hmmm",`url(#${element.id})` )
          e.setAttribute('mask', `url(#mask-${element.id})`);
        });
        
        // make the blur layer visible, with an ease animation in css
        blurLayer.forEach((e) => {
          e.style.opacity = "100";
        });
      });
      
      element.addEventListener("mouseout", () => {
        console.log(`mouse off: ${element.id}`);
        
        // make the blur layer dissapear with an eas out in css
        blurLayer.forEach((e) => {
          e.style.opacity = "0";
        });
      });

    }); 

  }

)
.catch(error => console.error("Error loading the SVG:", error));








