//For an image represented as an array of 1D of pixel data, get its average color;
//To get the avg color of a split section of the image, set the X, Y, width and height of the section;
//To get the avg color of an entire image, use section dimensions = image dimensions.
//usage: const avgColor = getAvgColor([0, 1, 128, ...], 100(px), 0, 0, 20(px), 30(px))
//  ------> "x" axys
//  |__|
//  |
//  V       "y" axys
function getAvgColor(pixels, imageWidth, x, y, width, height) {

  // function bubbleSort(arr) {
  //   function swap(arr, i, j) {
  //     let temp = arr[i]
  //     arr[i] = arr[j]
  //     arr[j] = temp
  //   }
  //   for (var i = 0; i < arr.length; i++) {
  //     for (var j = 0; j < (arr.length - i - 1); j++) {
  //       if (arr[j] > arr[j + 1]) {
  //         swap(arr, j, j+1)
  //       }
  //     }
  //   }
  // }

  function quickSort(arr) { //Iteractive

    function partition(arr, low, high) {
      const pivot = arr[high]
      let i = low
      for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
          [arr[i], arr[j]] = [arr[j], arr[i]]
          i++
        }
      }
      [arr[i], arr[high]] = [arr[high], arr[i]]
      return i
    }

    if (arr.length <= 1) return arr
    const stack = [{ start: 0, end: arr.length - 1 }]
    while (stack.length > 0) {
      const { start, end } = stack.pop()
      if (start >= end) continue
      const pivotIndex = partition(arr, start, end)
      stack.push({ start, end: pivotIndex - 1 })
      stack.push({ start: pivotIndex + 1, end })
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
    // section.sort()
    // bubbleSort(section)
    quickSort(section)
    // console.log(section)
    avg[channel] = section[section.length / 2]
  }
  // console.log(avg)
  return avg
}

module.exports = getAvgColor
