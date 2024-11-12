import { getInfo } from "./helpers/fetch";
import * as d3 from 'd3';

const overlay = 'https://cdn.prod.website-files.com/66e5c9799b48938aa3491deb/6733d2420789cc2da6969020_interact.svg';
const bgPng = 'https://cdn.prod.website-files.com/66e5c9799b48938aa3491deb/66e9c54c991f31f33b894e29_new-bg.png';

// get the card items from the DOM
const card = document.querySelector(".info-card-mplace");
const cardTitle = card.children[0];
const cardBody = card.children[1];

// variables
let cardHoverState = "";
// Detect if the device supports touch (mobile/tablet)
const isTouchDevice = 'ontouchstart' in document.documentElement;

d3.xml( overlay )
  .then(data => {
    const svg = data.documentElement;
    svg.id = "overlay-item"; // Assign an ID 
    // Select the SVG element using D3 to use D3 methods
    const d3Svg = d3.select(svg); 
    // add the svg and the png baackground to the DOM
    d3Svg.insert("image", ":first-child")
      .attr("href", bgPng)
      .attr("x", 0)                   
      .attr("y", 0)                   
      .attr("width", 1489.09)           
      .attr("height", 1046.52);       

    const svgContainer = document.querySelector(".svg-container-mplace");
    svgContainer.appendChild( svg );
    
  })
  
  .then( data => {
    // get the added svg
    const svg = document.body.querySelector("#overlay-item");
    // svg.preserveAspectRatio = "xMidYMid slice";

    // get the info
    const info = getInfo();
    console.log("chweck it out: ", info);

    // get the buttons
    const buttonsDom = svg.querySelectorAll(".button");
    const buttons = [...buttonsDom];

    // get the blur image
    const blurLayer = svg.querySelectorAll(".svg-blur-image");
    // console.log("buttons", blurLayer)
    
    // then add the event listeners
    // detect when mouse is over item
    info.forEach( ( element ) => {
      // match the button to the info id
      const match = buttons.find((e) => e.id === element.idMatch);
      
      // add mouseover event to the buttons
      const hoverOr = isTouchDevice ? "onclick" : "mouseover";

      match.addEventListener( hoverOr, ( event ) => {
        console.log("event target", match.id)
        if( match.id !== cardHoverState ) {

          // get the id and replace the mask url
          blurLayer.forEach((e) => {
            e.setAttribute('mask', `url(#mask-${match.id})`);
          });
          
          // make the blur layer visible, with an ease animation in css
          blurLayer.forEach((e) => {
            e.style.opacity = "100";
            match.style.strokeWidth = "5px";
            match.style.stroke = "rgb(255,0,0,0.1)";
          
          });
  
          // make the card visible
          card.style.opacity = "100";
          card.style.top = `${event.y - 50}px`;
          card.style.left = `${event.x - 50}px`;
          cardTitle.innerText = element.title;
          cardBody.innerText = element.body
        }
        cardHoverState = match.id;
      });
      
      match.addEventListener("mouseout", () => {
        // console.log(`mouse off: ${match.id}`);
        
        // make the blur layer dissapear with an eas out in css
        blurLayer.forEach((e) => {
          e.style.opacity = "0";
          match.style.stroke = "rgb(255,0,0,0)";
        });

        card.style.opacity = "0";

        cardHoverState = "";
      }); 
    });
    
  }

)
.catch(error => console.error("Error loading the SVG:", error));








