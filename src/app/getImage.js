//For a 16x16 image (for ex.), returns the object:
//shape:
//[16, 16, 4]: width, height, channels
//pixels:
//[1, 124, 48, 255, 1, 124, 48, 255, ...]: 40.000 1D-array of pixels data (16 * 16 * 4 channels) in raster order.
// R,  G,  B,  a,   R,  G,  B,  a, ...
//|<-  Pixel #1  ->|<- Pixel #2 ->|

const getPixels = require("get-pixels")

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
