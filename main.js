import { getInfo } from "./helpers/fetch";
import * as d3 from 'd3';


// this approach makes the background opacity go down and all the other buttons

const overlay = 'https://cdn.prod.website-files.com/66e5c9799b48938aa3491deb/67489b1749db02e317ab4fcf_new-active-buttons.svg';
const bgPng = 'https://cdn.prod.website-files.com/66e5c9799b48938aa3491deb/674f88456fdef5f3e049f128_market-bg-no-arrows.png';

// select the card items from the DOM
const card = document.querySelector(".info-card-mplace");
// select the title
const cardTitle = card.children[0];
// select the full-story item
const fullStories = document.querySelectorAll(".market-place-story-grid");

// card hover state: 0 = hover off, 1 = hovering, 2 = full-story mode
let cardHoverState = 0; 

// detect if a touch device
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// hide all the stories
function hideStories() {
  fullStories.forEach((story) => {
    story.style.pointerEvents = "none"; 
    story.style.display = "none";
  });
}

d3.xml( overlay )
  .then(data => {
    // Get the root SVG element from the loaded file
    const svg = data.documentElement;
    svg.id = "overlay-item"; // Assign an ID for reference
    
    // Select the SVG element using D3 to use D3 methods
    const d3Svg = d3.select(svg);

    // Insert the PNG as an <image> element at the start of the SVG
    d3Svg.insert("image", ":first-child") // Inserts as the first child
      .attr("href", bgPng) // Path to your PNG
      .attr("x", 0)
      .attr("y", 0)
      .attr("class", "bgPng")
      
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
    
    // select the bgPng
    const bg = d3.select('.bgPng');

    // select all the groups in the overlay
    const theGroups = d3Svg.selectAll('g');
    // console.log("the groups", theGroups);

    // make all buttons go transparent?
    function fadeOut( exclude ) {
      const excludeNode = exclude.node();
      theGroups
        .transition()
        .duration(1000) 
        .ease(d3.easeLinear) 
        .style("opacity", function(d, i) {
          // If the element is the one to exclude, keep full opacity
          return this === excludeNode ? 1 : 0.2;
        }); 
    }

    function fadeIn() {
      theGroups.transition()
        .duration(1000) 
        .ease(d3.easeLinear) 
        .style("opacity", function() {
          if(this.id.includes('towards')) {
            return 0.1;
          } else {
            return 1;
          }
          
        }); 
    }  
    
    // get the info
    const info = getInfo();
    // console.log("info", info)
    // then add the event listeners
    // detect when mouse is over item
    info.forEach( ( element ) => {
      // find the match to the current element 
      const theMatch = theGroups.filter(function () {
        return this.id.toLowerCase() === element.idMatch.toLowerCase();
      });
     

      // add mouseover event to the buttons
      // if touch device use a click state, if not use mousein/mouseout 
      // console.log("touch device?: ", isTouchDevice)
      const enter = isTouchDevice ? "click" : "mouseenter";
      const leave = isTouchDevice ? "click" : "mouseleave"; 
      
      // if not touch device use hover for preview
      if( theMatch ) {
        theMatch
          .on( enter, function(event) {
            if( cardHoverState === 0 ) {
              // fade out background
              bg.transition()
                .duration(1000) 
                .ease(d3.easeLinear) 
                .style("opacity", 0.2); 
              // fade out all buttons
              fadeOut( theMatch );
  
              // make the card visible
              cardTitle.innerText = element.title;
              card.style.opacity = "100";
              
              // set the global state
              cardHoverState = 1;
            } 
          })
          .on( leave, function(event) {
            

            // set the global state
            if( cardHoverState === 1 ) {
              // Hide the blur layer and reset the stroke and opacity
              bg.transition()
              .duration(1000) 
              .ease(d3.easeLinear) 
              .style("opacity", 1); 
            
              fadeIn();
              card.style.opacity = "0";
              cardHoverState = 0;
            }
      
          })
          .on( "click", function(event){
            if( cardHoverState === 1 ) {
              card.style.opacity = "0";
              
              // select the full story
              const theStory = document.getElementById(`${element.selectMatch}`);
             
              if( theStory ) {
                theStory.style.pointerEvents = "auto";          
                theStory.style.display = "grid";
              }
              // set the global state
              cardHoverState = 2; 
            }
            
          })
        
      }
    })

    // add event listener to close full-story on click
    fullStories.forEach((story) => {
      story.addEventListener("click", (event) => {
        if( cardHoverState === 2 ) {
          // const images = document.querySelectorAll('.dyn-images');
          // const cont = document.querySelector('.full-img-container');
          // // remove the pictures
          // images.forEach((item) => {
          //   cont.removeChild( item );
          // });
          // hide the stories
          hideStories();
          
          cardHoverState = 0;
        }
      }); 


    });
    
  })
.catch(error => console.error("Error loading the SVG:", error));








