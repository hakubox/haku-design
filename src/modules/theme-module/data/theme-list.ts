import type { ThemeConfig } from "../index.d";

export const themeList = [
  { code: 'theme-default', title: '默认主题' },
  {
    code: 'P1013',
    title: '心理干预通用平台-问卷主题',
    primaryColor: '#7983FD',
    appBackgroundColor: '#FAFBFC',
    contentFontColor: '#323233',
    titleAlign: 'left',
    titleFontColor: '#323233',
    titleFontSize: '18px',
    css: `// 心理通用平台-患者端-问卷主题
:root {
--primary-color: #5A6FFF;
--primary-active-bg-color: #F0F1FA;
--app-background-color: white;
@primary-color: #5A6FFF;
}

.app-canvas {

// 问卷标题
> .form-title {
}

&.normal-page {
background-color: white;

// 问卷内容
> .form-content {

  // 测评时长标签
  .form-content-badge {
    background: #FFFFFF;
    color: #7A81DC;
    padding: 4px 10px;
    box-shadow: 0px 4px 12px 0px #F0F1FA;
    border-radius: 12px;
  }

  // 描述标签
  .form-content-description {
    color: #727983;
    background: #FAFBFC;
  }

  .layout-component {

    // 折叠面板
    &.component-collapse {
      margin: 10px;
      border: 1px solid #E0E1EC;
      border-radius: 6px;

      > .component-collapse-item {

        > .component-collapse-item-header {
          background-color: #FAFBFC;
          border-bottom-color: #E0E1EC;
        }

        + .component-collapse-item {
          border-top: 1px solid #E0E1EC;
        }
      }
    }
  }

  // 通用组件样式
  .component-item {

    // 单选题
    &.component-item-single {

      > input {
        background-color: white;
      }
    }

    // 多选题
    &.component-item-multiple {

      > textarea {
        min-height: 200px;
        background: #FFFFFF;
        box-shadow: 0px 4px 12px 0px #F0F1FA;
        border-radius: 12px;
        border: none;
      }
    }

    // 可选择卡片
    &.component-card-picker {

      > .component-card-list {
        
        > .component-card-item {
        }
      }
    }
  }
}
}

&.end-page {

}
}`
  },
  {
    code: 'theme-psychologic-questionnaire',
    title: '心理通用平台-患者端-问卷主题',
    primaryColor: '#7983FD',
    appBackgroundColor: '#FAFBFC',
    contentFontColor: '#323233',
    titleAlign: 'left',
    titleFontColor: '#323233',
    titleFontSize: '18px',
    css: `// 心理通用平台-患者端-问卷主题
.app-canvas {

// 问卷标题
> .form-title {
}

&.end-page {
background-image: linear-gradient(180deg, #7273DC 0%, rgba(178,183,240,0) 100%);
background-size: 100% 280px;
background-repeat: no-repeat;

// 问卷内容
> .form-content {

  // 通用组件样式
  .component-item {

    &.component-anx-stepper,
    &.form-complete-description {
      box-shadow: 0px 4px 12px 0px #F0F1FA;
      border-radius: 12px;
      background-color: white;
    }
  }
}
}

&.normal-page {
background-image: linear-gradient(180deg, #C6C8EF 0%, rgba(250,251,252,0) 100%);
background-size: 100% 180px;
background-repeat: no-repeat;

// 问卷内容
> .form-content {

  // 测评时长标签
  .form-content-badge {
    background: #FFFFFF;
    color: #7A81DC;
    padding: 4px 10px;
    box-shadow: 0px 4px 12px 0px #F0F1FA;
    border-radius: 12px;
  }

  // 描述标签
  .form-content-description {
    color: #5B6B8A;
  }

  // 通用组件样式
  .component-item {

    &.component-single-choice {
      padding: 15px;
      box-shadow: 0px 4px 12px 0px #F0F1FA;
      border-radius: 12px;
      margin: 10px !important;
      background-color: white;
    }

    &.component-item-multiple {

      > textarea {
        min-height: 200px;
        background: #FFFFFF;
        box-shadow: 0px 4px 12px 0px #F0F1FA;
        border-radius: 12px;
        border: none;
      }
    }
  }
}
}

&.end-page {

}
}`
  },
  {
    code: 'theme-psychologic-courseware',
    title: '心理通用平台-患者端-课程主题',
    primaryColor: '#7983FD',
    appBackgroundColor: '#F3F1FF',
    contentFontColor: '#323233',
    titleAlign: 'left',
    titleFontColor: '#323233',
    titleFontSize: '18px',
    css: `// 心理通用平台-患者端-课程主题
.app-canvas {

// 问卷标题
> .form-title {
}

&.end-page {
background-image: linear-gradient(180deg, #7273DC 0%, rgba(178,183,240,0) 100%);
background-size: 100% 280px;
background-repeat: no-repeat;

// 问卷内容
> .form-content {

// 通用组件样式
.component-item {

&.component-anx-stepper {
  box-shadow: 0px 4px 12px 0px #F0F1FA;
  border-radius: 12px;
  background-color: white;
}
}
}
}

&.normal-page {
background-image: linear-gradient(180deg, #C6C8EF 0%, rgba(250,251,252,0) 100%);
background-size: 100% 180px;
background-repeat: no-repeat;

// 问卷内容
> .form-content {

// 测评时长标签
.form-content-badge {
background: #FFFFFF;
color: #7A81DC;
padding: 4px 10px;
box-shadow: 0px 4px 12px 0px #F0F1FA;
border-radius: 12px;
}

// 描述标签
.form-content-description {
color: #5B6B8A;
}

// 通用组件样式
.component-item {

&.component-single-choice {
  padding: 15px;
  box-shadow: 0px 4px 12px 0px #F0F1FA;
  border-radius: 12px;
  margin: 10px !important;
  background-color: white;
}
}
}
}

&.end-page {

}
}`
  },
  { 
    code: 'theme-dysarthria-questionnaire', 
    title: '构音障碍-采集端-问卷主题', 
    primaryColor: '#7983FD', 
    appBackgroundColor: '#FAFBFC',
    contentFontColor: '#323233',
    titleAlign: 'left',
    titleFontColor: '#323233',
    titleFontSize: '18px',
    css: `
    .app-canvas {

      // 问卷标题
      > .form-title {
      }
    
      &.end-page {
        background-image: linear-gradient(180deg, #7273DC 0%, rgba(178,183,240,0) 100%);
        background-size: 100% 280px;
        background-repeat: no-repeat;
        
        // 问卷内容
        > .form-content {
    
          // 通用组件样式
          .component-item {
    
            &.component-anx-stepper,
            &.form-complete-description {
              box-shadow: 0px 4px 12px 0px #F0F1FA;
              border-radius: 12px;
              background-color: white;
            }
          }
        }
      }
    
      &.normal-page {
        background-image: linear-gradient(180deg, #C6C8EF 0%, rgba(250,251,252,0) 100%);
        background-size: 100% 180px;
        background-repeat: no-repeat;
        
        // 问卷内容
        > .form-content {
    
          // 测评时长标签
          .form-content-badge {
            background: #FFFFFF;
            color: #7A81DC;
            padding: 4px 10px;
            box-shadow: 0px 4px 12px 0px #F0F1FA;
            border-radius: 12px;
          }
    
          // 描述标签
          .form-content-description {
            color: #5B6B8A;
          }
    
          // 通用组件样式
          .component-item {
    
            &.component-single-choice {
              padding: 15px;
              box-shadow: 0px 4px 12px 0px #F0F1FA;
              border-radius: 12px;
              margin: 10px !important;
              background-color: white;
              .van-radio {
                position: relative;
                margin-right: 0;
              }
              .van-radio__icon {
                height: auto;
              }
              .van-icon {
                width: 60px;
                height: 34px;
                border-radius: 6px;
                background-color: #fff;
                border-bottom: 6px solid #C4BBEE;
              }
              .van-radio__label {
                position: absolute;
                width: 100%;
                text-align: center;
                overflow: hidden;
                margin-left: 0;
              }
            }
    
            &.component-item-multiple {
    
              > textarea {
                min-height: 200px;
                background: #FFFFFF;
                box-shadow: 0px 4px 12px 0px #F0F1FA;
                border-radius: 12px;
                border: none;
              }
            }
          }
        }
      }
    
      &.end-page {
    
      }
    }
    `
  },
] as ThemeConfig[];