//For an image represented as an array of 1D of pixel data, get its average color;
//To get the avg color of a split section of the image, set the X, Y, width and height of the section;
//To get the avg color of an entire image, use section dimensions = image dimensions.
//usage: const avgColor = getAvgColor([0, 1, 128, ...], 100(px), 0, 0, 20(px), 30(px))
//  ------> "x" axys
//  |__|
//  |
//  V       "y" axys
function getAvgColor(pixels, imageWidth, x, y, width, height) {

  function sort(arr) {
    for (var i = 0; i < arr.length; i++) {
      for (var j = 0; j < (arr.length - i - 1); j++) {
        if (arr[j] > arr[j + 1]) {
          var temp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = temp
        }
      }
    }
  }

  const avg = [0, 0, 0] //R, G, B
  //V1 - Medium value: [..., 27, 28, 29, ...]: array of values of a single channel in asc order. Get the middle element (in the ex., "28")
  for (let channel = 0; channel < 3; channel++) {
    const section = []
    for (let j = y; j < y+height; j++) {
      for (let i = x; i < x+width; i++) {
        // console.log("i:", i, "j:", j, "index:", ((i*4) + j*imageWidth*4) + channel, "value:", pixels[((i*4) + j*imageWidth) + channel])
        section.push(pixels[((i*4) + j*imageWidth*4) + channel])
      }
    }
    sort(section)
    // console.log(section)
    avg[channel] = section[section.length / 2]
  }
  // console.log(avg)
  return avg
}

module.exports = getAvgColor
