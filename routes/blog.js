const express = require('express');
const router = express.Router();
const Validate = require('../Middlewares/Validate');
const Blog = require('../models/Blog');
const User = require('../models/User');

const tempData = {"author":"Rizvi Hassan","date":"December 22, 2023","head":"This is the heading","title":"This is the title","mainImg":"https://img.freepik.com/free-photo/natures-beauty-captured-colorful-flower-close-up-generative-ai_188544-8593.jpg","tag":"public","elements":[["p","Enter the content of paragraph",0],["h2","Enter the subheading",1],["p","Enter the content of paragraph.\nEnter the content of paragraphEnter the content of paragraphEnter the content of paragraphEnter the content of paragraphEnter the content of paragraphEnter the content of paragraphEnter the content of paragraphEnter the content of paragraph.Enter the content of paragraph\nEnter the content of paragraphEnter the content of paragraphEnter the content of paragraphEnter the content of paragraphEnter the content of paragraph",2]]}

// Route 1: It addes new blogs to the database  P.S. Login required
router.post('/addblog', Validate, async (req, res) => {
    
    try {
        
        //Checking if user already exists
        const id = req.user.id;
        const user = await User.findById(id);
        if (user) {
            const data = req.body;
            const blog = new Blog({user: id, author: data.author, date: data.date, head: data.head, title: data.title, mainImg: data.mainImg, tag: data.tag, elements: data.elements});
            const save = await blog.save();
            res.send(save);
        }
        else {
            res.status(401).json({ attenpt: 'fail', errors: { msg: 'Unauthorised user' } });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ attempt: 'fail', errors: { msg: "Something went wrong " } })
    }
})


// Route 2: To fetch all the non-private blogs of all users.  P.S. Login not required
router.get('/fetchblogs', async(req, res) =>{
    try {
        let data = await Blog.find().sort([['date', -1]]);
        data = data.filter((value)=>{
            return (value.tag !== 'PRIVATE')
        })
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ attempt: 'fail', errors: { msg: "Something went wrong " } })
        
    }
})

//Route 3: To fetch all the blogs of an individual user. P.S. Login required
router.get('/fetchpersonal', Validate, async(req, res) =>{
    try{
        const id = req.user.id;
        const user = await User.findById(id);
        if(user)
        {
            let data = await Blog.find({user: id}).sort([['date', -1]]);
            res.json(data)
        }
        else{
            res.status(401).json({attempt: 'fail', errors: {msg: 'Unauthorised User.'}})
        }
    }
    catch(error){
        console.error(error);
        res.status(500).json({ attempt: 'fail', errors: { msg: "Something went wrong " } });
         
    }
})

//Route 4: To delete a blog of a user. P.S. Login required
router.delete('/deleteblog/:id', Validate, async(req, res)=>{
    try {
        const id= req.user.id;
        let blog = await Blog.findById(req.params.id);
        if(!blog){ return res.status(404).json({attempt:'fail', errors:{msg: 'Blog not found.'}})}

        if(blog.user.toString() !== id){
            return res.status(401).json({attempt: 'fail', errors:{msg:'You are not allowed to delete this blog.'}})
        }
        const out = await Blog.findByIdAndDelete(req.params.id);
        res.json({attempt: 'success', out});
    } catch (error) {
        console.error(error);
        res.status(500).json({ attempt: 'fail', errors: { msg: "Something went wrong " } });
    }
});

//Route 5: To update a blog of a user. P.S. Login required
router.put('/updateblog/:id', Validate, async(req, res)=>{
    try{
        const user = req.user.id;
        let blog = await Blog.findById(req.params.id);
        if(!blog){
            return res.status(404).json({attempt:'fail', errors:{msg: 'Blog not found.'}})
        }
        if (blog.user.toString() !== user){
            return res.status(401).json({attempt: 'fail', errors:{msg:'You are not allowed to update this blog.'}})
        }
        const out = await Blog.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json({status: 'success', out});

    }
    catch(error){
        console.error(error);
        res.status(500).json({ attempt: 'fail', errors: { msg: "Something went wrong " } });
    }
})


module.exports = router;