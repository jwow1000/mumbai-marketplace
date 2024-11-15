import { getInfo } from "./helpers/fetch";
import * as d3 from 'd3';

const overlay = 'https://cdn.prod.website-files.com/66e5c9799b48938aa3491deb/6735469de4922c58f5af63b3_mplace-buttons.svg';
const bgPng = 'https://cdn.prod.website-files.com/66e5c9799b48938aa3491deb/67354a2d1d2f1e50c965337b_mplace-background.png'

// select the card items from the DOM
const card = document.querySelector(".info-card-mplace");
// select the title
const cardTitle = card.children[0];
// select the full-story item
const fullStory = document.querySelector(".full-story");
// select the full story title, body-text, and picture container
const fullStoryTitle = fullStory.querySelector('.full-title');
const fullStoryBody = fullStory.querySelector('.full-body-text');
const fullStoryImgs = fullStory.querySelector('.full-img-container');


// card hover state: 0 = hover off, 1 = hovering, 2 = full-story mode
let cardHoverState = 0; 


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
      .attr("fill", "black")
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


      // add mouseover event to the buttons
      // if touch device use a click state, if not use mousein/mouseout 
      
      match.addEventListener( "pointerenter", ( event ) => {
        console.log("hover state: ", cardHoverState)
        if( cardHoverState === 0 ) {
          
          blurLayer
            .attr("mask", `url(#${match.id}_mask)`)
            .style("opacity", 0.8);
          
          // make the card visible
          cardTitle.innerText = element.title;
          card.style.opacity = "100";
          
          // set the global state
          cardHoverState = 1;
        }
        
      });
      
      match.addEventListener("pointerleave", () => {
        // Hide the blur layer and reset the stroke and opacity
        blurLayer
          .style("opacity", 0)

        card.style.opacity = "0";

        // set the global state
        if( cardHoverState === 1 ) {

          cardHoverState = 0;
        }
        
      });
      
      match.addEventListener("pointerdown", () => {
        
        if( cardHoverState === 1 ) {
          // set the global state
          cardHoverState = 2;
          
          // open the full story
          fullStoryTitle.innerText = element.title;
          fullStoryBody.innerText = element.body;
          
          // make an img element
          if( element.img ) {
            console.log("render an image")
            const image = document.createElement('img');
            image.src = element.img;
            image.className = "dyn-images";
            fullStoryImgs.appendChild( image );

          }
          fullStory.style.pointerEvents = "auto";          
          fullStory.style.display = "block";
          
        }
        
      })
    });

    // add event listener to close full-story on click
    fullStory.addEventListener("click", (event) => {
      if( cardHoverState === 2 ) {
        const images = fullStory.querySelectorAll('.dyn-images');
        const cont = document.querySelector('.full-img-container');
        // remove the pictures
        images.forEach((item) => {
          cont.removeChild( item );
        });

        fullStory.style.pointerEvents = "none"; 
        fullStory.style.display = "none";
        cardHoverState = 0;
      }
    });
    
  }

)
.catch(error => console.error("Error loading the SVG:", error));








