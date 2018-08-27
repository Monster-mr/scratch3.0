
const React = require('react');
const nodemailer = require('nodemailer');

class NodemailerCom extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            showNodemail:this.props.showNodemail,
        }
    }
    componentWillReceiveProps(nextProps, nextState){
        this.setState({
            showNodemail: nextProps.showNodemail
        })
    }
    sendmail(req, res, next) {
        debugger;
        var mail=this.myInput.value; //反馈内容
        var ymail=this.ymail.value; //邮箱规范
        if(!mail){
            alert("温馨提示：信息反馈框不能为空");
            return;
        }
        if (!ymail) {
            alert( "请输入邮箱地址！");
            return;
        }
        //检测邮箱地址是否符合规范
        var reg = /^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,5}$/;
        if (!ymail.match(reg)) {
            alert( "邮箱地址不符合规范，请重新输入！");
            return;
        }
        var transporter = nodemailer.createTransport({
            service: 'qq',
            secureConnection: true,
            port: 465,
            auth: {
                user: '1367050904@qq.com',//发送账号的邮箱
                pass: 'vkvpdzxmlwxpbaah'//发送账号的验证码
            }
        });
        var mailOptions = {
            from: '1367050904@qq.com', // 发送账号的邮箱
            to:'1498656178@qq.com', // 接收账户的邮箱可以是多个
            subject: '测试邮件', // 邮件主题
            html:mail+"<br/>"+ymail   //邮件内容
        };
        transporter.sendMail(mailOptions, function(error, response){
            console.log(error);
            console.log(response);
            if(error){
                alert("发送失败");
            }else{
                alert("发送成功 ");
            }
        });
        this.myInput.value='';
        this.ymail.value='';
        this.props.nodeMailer();
    };
    render() {
        const {
            ...componentProps
        } = this.props;
        var showNodemail = this.state.showNodemail?"block":"none";
        var stylenodemailer={display: showNodemail, width: '500px', height: '150px', background: '#ffffff', position: 'absolute', left: '50%',
            top: '100px', marginLeft: '-250px', zIndex:'99999',};
        var text={width:'240px',height:'30px',paddingLeft:'5px',};
        var btn={ width:'80px', height:'30px',};
        return (
  <div style={stylenodemailer}>{/*onMouseLeave={this.props.nodeMailer}*/}
      <form id='mailsend' action='mailto:1498656178@qq.com' method='get'>
              <textarea name="mailbody" cols="70" rows="14"  ref={ (input) => this.myInput = input }></textarea>
              <input style={text} type="text" placeholder="请您输入您的邮箱账户供我们回复" ref={ (input) => this.ymail = input }/>
              <input style={btn} type="submit" name="Submit" value="发送邮件" onClick={this.sendmail.bind(this)} />
              <input style={btn} type="reset" name="reset" value="重新编辑"/>
              <input  style={btn} type="button" value="取消反馈" onClick={this.props.nodeMailer}/>
      </form>
  </div>
        )
    }
};

export default NodemailerCom;
