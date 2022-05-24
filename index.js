export default class Problem{
    
    constructor(){
        //保存按钮的点击事件
        let save = this.$('.save-data')
        save.addEventListener('click',this.saveData)
        //给tbody绑定事件
        this.$('.table tbody').addEventListener('click',this.distribute.bind(this))
        //获取删除模态框确认按钮的节点
        // console.log(this.$('.confirm-del'))
         this.$('.confirm-del').addEventListener('click',this.confirmDel.bind(this))
        //获取修改模态框确认按钮的节点
        this.$('.modifyModal').addEventListener('click',this.saveModify.bind(this))
        // console.log(this.$('tbody'))

        this.getData()
    }
    //分配删除和修改按钮
    distribute(eve){
        let tar = eve.target
        if(tar.classList.contains('delBtn')) this.delData(tar)
        if(tar.classList.contains('btn-modif')) this.modifyData(tar)
        // console.log('这是删除按钮')
        //   console.log(tar)
        //  $('#delModal').modal('show')
    }
    //弹出删除模态框
    delData(target){
        this.target = target
        $('#delModal').modal('show')
    }
    findTr(target){
        if(target.nodeName =='TR'){
            return target
        }else{
            return this.findTr(target.parentNode)
        }
    }
    //弹出修改态框,框里有需要修改的内容
    modifyData(target){
        this.target = target
        $('#modifyModal').modal('show')
        let trObj=this.findTr(target)
        // if(this.target.nodeName =='SPAN'){
        //     trObj = this.target.parentNode.parentNode.parentNode
        // }
        // if(this.target.nodeName =='BUTTON'){
        //     trObj = this.target.parentNode.parentNode
        // }
        // console.log(trObj)   tr
        //将tr里的东西添加到input框里面
        let chil = trObj.children
        // console.log(chil)
        let id = chil[0].innerHTML
        let title = chil[1].innerHTML
        let pos = chil[2].innerHTML
        let idea = chil[3].innerHTML

        //获取modifyModal下form的表单
        let form = this.$('#modifyModal form').elements
        // console.log(form)
        form.name.value = title;
        form.pos.value = pos;
        form.idea.value = idea;
        this.modifyId = id;
    }
    //点击修改按钮
    saveModify(target){
        // console.log(11)
        // let trObj
        // axios.patch("http://localhost:3000/problem"[, data[, config]])
        let {name,pos,idea} = this.$('#modifyModal form').elements
        // console.log(name,pos,idea)
        let titleVal = name.value.trim()
        let posVal =pos.value.trim()
        let ideaVal =idea.value.trim()
        if(!titleVal||!posVal||!ideaVal) return
        // console.log(titleVal,posVal,nameVal)
         axios.patch("http://localhost:3000/problem/"+this.modifyId,{
             title:titleVal,
             pos:posVal,
             idea:ideaVal
         }).then(res=>{
             if(res.status ==200){
                 location.reload()
             }
         })
    }
    //删除数据this.modifyId
    confirmDel(){
        console.log(this.target)
        let trObj='';
        if(this.target.nodeName=='SPAN'){
            trObj = this.target.parentNode.parentNode.parentNode
        }
        if(this.target.nodeName=='BUTTON'){
            trObj = this.target.parentNode.parentNode
        }
        let id = trObj.children[0].innerHTML
        // console.log(id)
        axios.delete('http://localhost:3000/problem/'+id).then(res=>{
            if(res.status ==200){
                location.reload()
            }
        })
        
    }


    // 保存数据
    saveData(){
        //1.添加表单数据
        let form = document.forms[0].elements
        console.log(this)
        // 去除空格
        let name = form.name.value.trim()
        let pos = form.pos.value.trim()
        let idea = form.idea.value.trim()
        // console.log(title,pos,idea)
        //2.判断表单中每一项是否有值,如果为空,则提示
        if(!name||!pos||!idea){
            // return alert("不能为空")
            throw new Error('不能为空')
        }
        //3.数据通过ajax,发送给json-server,保存数据

        axios.post('http://localhost:3000/problem', {
            title:name,
            pos,
            idea
          })
          .then(function (response) {
              //如果请求成功则刷新页面
            if(response.status == 201){
                location.reload()
            }
          })
        
         
    }
    //获取数据
    getData(){
            //1.发送ajax请求,获取数据
        axios.get("http://localhost:3000/problem").then(res=>{
            let tr = this.$('tbody')
            //2.获取返回值中的data和status
            //  console.log(res)
            let {data,status} = res
            // console.log(data,status)
            //3.当状态为200时,表示请求成功
            let html = ''
            if(status == 200){
            //4.获取数据后渲染到页面中
                data.forEach(ele => {
                   html+=`<tr>
                   <th scope="row">${ele.id}</th>
                   <td>${ele.title}</td>
                   <td>${ele.pos}</td>
                   <td>${ele.idea}</td>
                   <td>
                   <button type="button" class="btn btn-info btn-xs delBtn">
                   <span class="glyphicon glyphicon-trash delBtn" aria-hidden="true"></span>
                   </button>
                   <button type="button" class="btn btn-warning btn-xs btn-modif ">
                   <span class="glyphicon glyphicon-refresh btn-modif" aria-hidden="true"></span>
                   </button>
                   </td>
                 </tr>` 
                });
                tr.innerHTML = html;
            }
            
        })
    }
    $(ele){
        
        let res =  document.querySelectorAll(ele);
        return res.length ==1?res[0]:res
        
    }
}

new Problem()