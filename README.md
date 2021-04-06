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

## Demo
[Demo](https://pinkcao.github.io/customize-data-visualization/dist/index.html)

具体的使用效果与mock设置的延时相关，每次调整组件后都会将后端数据重新反馈至前端更新保持一致
因此当网络质量差/mock设置的延时高时，通过鼠标调整组件位置、旋转的体验较差

关于3D模型：预览状态读取的是经过处理的导出后模型，需要导出后直接丢在public文件夹下，文件名为exportTest.gltf

目录结构:  
├─assets  
│    ├─pics  
│    └─styles  
├─common  
│    ├─commonComponents  
│    │    ├─funnelChart  
│    │    ├─graphcharts  
│    │    ├─kChart  
│    │    ├─polarBarChart  
│    │    ├─radarChart  
│    │    └─vueDragResizeRotate  
│    ├─commonStyle  
│    │    ├─compColStyle  
│    │    ├─graphColStyle  
│    │    └─setColStyle  
│    └─core  
├─components  
│    ├─basicComponents  
│    │    ├─picComponent  
│    │    └─textComponent  
│    ├─colComponents  
│    │    ├─componentCol  
│    │    ├─componentSet  
│    │    ├─graphCol  
│    │    ├─mainCanvas  
│    │    └─pageSet  
│    ├─componentsDef  
│    └─visComponents  
│        ├─graphComponent  
│        └─mapComponent  
├─layout  
├─mock  
│    └─mockData  
├─router  
├─store  
└─views