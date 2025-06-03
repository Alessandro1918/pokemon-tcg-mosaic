export const gridConstants = {
  25: { 
    screen: { 
      mobile: { zoomMin: 4, zoomMax: 100, cardWidth: 16 /*/px */ },
      sm: { zoomMin: 5, zoomMax: 125, cardWidth: 20 /*/px */ } 
    }
  },
  50: { 
    screen: { 
      mobile: { 
        zoomMin: 2,   //grid section width = 8px, 8/4 = 2
        zoomMax: 100, //zoom needed to section width = grid width: zoomMin * gridSize
        cardWidth: 8  //in pixels. Grid section width is hardcoded, and grid width = gridSize * section width
      },
      sm: { zoomMin: 2.5, zoomMax: 125, cardWidth: 10 /*/px */ } 
    }
  },
  75: { 
    screen: { 
      mobile: { zoomMin: 1.5, zoomMax: 100, cardWidth: 6 /*/px */ },
      sm: { zoomMin: 1.875, zoomMax: 125, cardWidth: 7.5 /*/px */ } 
    }
  },
  100: { 
    screen: { 
      mobile: { zoomMin: 1, zoomMax: 100, cardWidth: 4 /*/px */ },
      sm: { zoomMin: 1.25, zoomMax: 125, cardWidth: 5 /*/px */ } 
    }
  }
}
