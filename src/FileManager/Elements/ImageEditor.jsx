import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import '../Assets/tui-image-editor.css'
// TOAST UI Image Editor 是一款功能强大的图像编辑器，提供了丰富的图像处理功能，如裁剪、翻转、旋转、应用滤镜等。
import ImageEditor from '@toast-ui/react-image-editor'
import whiteTheme from '../Assets/whiteTheme';
import ButtonList from './ButtonGroup';
import Dialog from '@material-ui/core/Dialog';
import Zoom  from '@material-ui/core/Zoom';

const useStyles = makeStyles(() => ({
  buttonsCont: {
    textAlign: 'center',
    borderRadius: '0px 0px 5px 5px',
    border: '1px solid #E9eef9',
    borderTop:'none',
    padding:'15px',
    background:'#fff'
  },
dialog:{
}

}));

export default function ImageEditPopup(props){
    const {closeCallBack, submitCallback, name,extension, path, open } = props;
    const classes = useStyles();
    const editorRef = React.createRef();

    const handleClickButton = (asNew) => {
      const format = extension !== '.jpg' ? 'jpeg' : 'png';
      // 将图像实例转换为base64数据
      const editorInstance = editorRef.current.getInstance();
      const imageData = editorInstance._graphics.toDataURL({
        quality: 0.7,
        format
      });
      submitCallback(imageData,asNew);
    };

    const buttons = [
      {
        name: 'submit',
        icon: 'icon-exit',
        label: 'Save & Quit',
        class: 'green',
        onClick: ()=>handleClickButton(false)
      },
      {
        name: 'update',
        icon: 'icon-save',
        label: 'Save as new file',
        class: 'blue',
        onClick: ()=>handleClickButton(true)
      },
      {
        name: 'submit',
        icon: 'icon-ban',
        label: 'Cancel',
        class: 'red',
        onClick: ()=>closeCallBack()
      }
    ];
    // 函数式组件不能接收引用，因为它们没有实例。当我们需要将引用传递给函数式组件的内部元素时，就需要使用 React.forwardRef。
    // zoom创建具有缩放功能动画效果
    const Transition = React.forwardRef((props, ref)=><Zoom in={props.open} ref={ref} {...props} />);
  
    return (
      <Dialog
        open={Boolean(open)}
        TransitionComponent={Transition}
        fullWidth
        maxWidth={'xl'}
        onClose={closeCallBack}
        className={classes.dialog}
      >
          <ImageEditor 
            ref={editorRef}
            includeUI={{
                loadImage: {
                    path: path,
                    name: name
                },
                theme: whiteTheme,
                initMenu: 'filter',
                uiSize: {
                    width: '100%',
                    height: '700px'
                },
                menuBarPosition: 'bottom'
            }}
                cssMaxHeight={500}
                selectionStyle={{
                cornerSize: 20,
                rotatingPointOffset: 70
            }}
            usageStatistics={true}
          />
          <div className={classes.buttonsCont} >
            <ButtonList buttons={buttons} />
          </div>
        </Dialog>
    );
}