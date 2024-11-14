import { getInfo } from "./helpers/fetch";
import * as d3 from 'd3';

const overlay = 'https://cdn.prod.website-files.com/66e5c9799b48938aa3491deb/6735469de4922c58f5af63b3_mplace-buttons.svg';
const bgPng = 'https://cdn.prod.website-files.com/66e5c9799b48938aa3491deb/67354a2d1d2f1e50c965337b_mplace-background.png'

// get the card items from the DOM
const card = document.querySelector(".info-card-mplace");
const cardTitle = card.children[0];
// const cardBody = card.children[1];

// variables
let cardHoverState = "";

// Detect if the device supports touch (mobile/tablet)
const isTouchDevice = 'ontouchstart' in document.documentElement;

d3.xml( overlay )
  .then(data => {
    // Get the root SVG element from the loaded file
    const svg = data.documentElement;
    svg.id = "overlay-item"; // Assign an ID for reference
    
    // Select the SVG element using D3 to use D3 methods
    const d3Svg = d3.select(svg);


    d3Svg.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "white")
      .attr("id", "blur" )
      .attr("opacity", 0)

    // Insert the PNG as an <image> element at the start of the SVG
    d3Svg.insert("image", ":first-child") // Inserts as the first child
      .attr("href", bgPng) // Path to your PNG
      .attr("x", 0)
      .attr("y", 0)
      
      // .attr("transform", "scale(0.95)")
      .attr("width", "100%")
      .attr("height", "100%");
    
      // Append the SVG to the DOM
    const svgContainer = document.querySelector(".svg-container-mplace");

    svgContainer.appendChild(svg);
  })
  
  .then( data => {
    // select the added svg
    const d3Svg = d3.select('#overlay-item');
    
    // select all the groups in the overlay
    const theGroups = d3Svg.selectAll('g').nodes();
    
    // get the info
    const info = getInfo();
    console.log("chweck it out: ", info);
    
    // get the buttons
    console.log("the buttons: ", theGroups)

    // get the blur image
    const blurLayer = d3.select("#blur");
    
    // then add the event listeners
    // detect when mouse is over item
    info.forEach( ( element ) => {
      // match the button to the info id
      const match = theGroups.find((e) => e.id === element.idMatch);
      console.log("look at the match: ", match)

      // make a mask for the match
      // Create a <defs> section if it doesn't already exist
      let defs = d3Svg.select("defs");
      if (defs.empty()) {
        defs = svg.append("defs");
      }
      // make a mask element, add an id
      const mask = defs.append("mask")
        .attr("id", `${match.id}_mask`);
        
      // Append a white rectangle (the mask background) to cover the entire SVG area
      mask.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "white")
        
      
      // clone and add the mask
      mask.append( () => match.cloneNode(true) )          // Clone the group
        .attr("fill", "black")                        // Set fill to black

      // add a state data attribute, 0 none. 1 hovered, 2 details
      match.setAttribute('data-state', 0);

      // add mouseover event to the buttons
      const hoverOr = isTouchDevice ? "onclick" : "mouseover";
      
      match.addEventListener( hoverOr, ( event ) => {
        const state =  match.getAttribute('data-state');
        console.log("data state get", state )
        if( match.id !== cardHoverState ) {
          console.log("event target", match.id, cardHoverState)
          blurLayer.attr("mask", "");
          blurLayer
            .attr("mask", `url(#${match.id}_mask)`)
            .style("opacity", 0.8)
          
          // make the card visible
          card.style.opacity = "100";
          
          cardTitle.innerText = element.title;
          
          // update state
          match.setAttribute('data-state', 1);
        }
        
        cardHoverState = match.id;
        console.log("cardhoverstate is set?: ", cardHoverState)
      });
      
      match.addEventListener("mouseout", () => {
        console.log(`mouse off: ${match.id}`);
        // Hide the blur layer and reset the stroke and opacity
        blurLayer
          .style("opacity", 0)

        card.style.opacity = "0";

        cardHoverState = "";
        // Update state
        match.setAttribute('data-state', 0);
      }); 

      match.addEventListener("click", () => {
        // open the story details, if hover is true
        const check = match.getAttribute('data-state');
        if( check === 1 ) {
          console.log("get the story details", match);
        }
      })
    });
    
  }

)
.catch(error => console.error("Error loading the SVG:", error));








