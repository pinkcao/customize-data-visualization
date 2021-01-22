# data-visualization

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

目录结构:
│ App.vue
│ main.js
│  
├─assets
│ ├─pics
│ │ K 线图.png
│ │ 图表组件.png
│ │ 文字组件.png
│ │ 暂无.png
│ │ 极坐标柱状图.png
│ │ 漏斗图.png
│ │ 雷达图.png
│ │  
│ └─styles
│ border.less
│ color.less
│ commonStyles.less
│ scrollbar.less
│  
├─common
│ ├─commonComponents
│ │ │ chartDef.js
│ │ │  
│ │ ├─funnelChart
│ │ │ funnelChart.vue
│ │ │  
│ │ ├─graphcharts
│ │ │ chart.js
│ │ │ chart.vue
│ │ │  
│ │ ├─kChart
│ │ │ kChart.vue
│ │ │  
│ │ ├─polarBarChart
│ │ │ polarBarChart.vue
│ │ │  
│ │ ├─radarChart
│ │ │ radarChart.vue
│ │ │  
│ │ └─vueDragResizeRotate
│ │ vueDragResizeRotate.vue
│ │  
│ ├─commonStyle
│ │ ├─compColStyle
│ │ │ compColStyle.js
│ │ │  
│ │ ├─graphColStyle
│ │ │ graphColStyle.js
│ │ │  
│ │ └─setColStyle
│ │ setColStyle.js
│ │  
│ └─core
│ loader.js
│  
├─components
│ ├─basicComponents
│ │ ├─picComponent
│ │ └─textComponent
│ │ titleText.vue
│ │  
│ ├─colComponents
│ │ ├─componentCol
│ │ │ compColAPI.js
│ │ │ componentCol.vue
│ │ │  
│ │ ├─componentSet
│ │ │ componentSet.vue
│ │ │  
│ │ ├─graphCol
│ │ │ graphCol.vue
│ │ │  
│ │ ├─mainCanvas
│ │ │ mainCanvas.vue
│ │ │  
│ │ └─pageSet
│ │ pageSet.vue
│ │  
│ ├─componentsDef
│ │ componentsDef.js
│ │  
│ └─visComponents
│ │ comMap.js
│ │  
│ ├─graphComponent
│ │ funnelComponent.vue
│ │ graphComponent.vue
│ │ kComponent.vue
│ │ polarBarComponent.vue
│ │ radarComponent.vue
│ │  
│ └─mapComponent
│ map.vue
│ mapComponent.vue
│  
├─layout
│ testLayout.vue
│  
├─mock
│ │ mockAPI.js
│ │ mockBus.js
│ │  
│ └─mockData
│ mockAPIData.js
│ mockBase.js
│ mockScreen.js
│  
├─router
│ index.js
│  
├─store
│ index.js
│  
└─views
basePage.vue
colorTest.vue
login.vue
notFound.vue
preview.vue
templateSelect.vue
