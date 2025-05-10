//For a 16x16 image (for ex.), returns the object:
//shape:
//[16, 16, 4]: width, height, channels
//pixels:
//[1, 124, 48, 255, 1, 124, 48, 255, ...]: 40.000 1D-array of pixels data (16 * 16 * 4 channels) in raster order.
// R,  G,  B,  a,   R,  G,  B,  a, ...
//|<-  Pixel #1  ->|<- Pixel #2 ->|

const getPixels = require("get-pixels")
// const smImg = "https://www.npmjs.com/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci80MmJlZjI1ODU5ZWY1OTIyODUzYThmMmE3YzdhNGNlZj9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.JTCwo1QFSJOROohvVLUAdrY_1A3z0vvpZJUB6gP-qh0"

// export function getImage(url: string): Promise<any> {  //TS
function getImage(url) {                                  //JS
  return new Promise((resolve, reject) => {
    getPixels(url, function(err, pixels) {
      if (err) {
        console.log(err)
        console.log("Bad image path")
        reject(err)
      } else {
        console.log("Got pixels:", pixels.shape.slice(), pixels.data)
        resolve({shape: pixels.shape.slice(), pixels: pixels.data})
      }
    })
  })
}

module.exports = getImage
