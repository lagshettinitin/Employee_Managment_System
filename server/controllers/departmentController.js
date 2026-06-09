import Department from "../modules/Department.js";

const getDepartments = async(req,res)=>{
    try{
        // 
         const departments = await Department.find()
         return res.status(200).json({success:true,departments})
    }
    catch(e){
        return res.status(500).json({success:false, error:"get department server error"});
        }

    }




const addDepartment = async(req,res)=>{
    try{
        // this will take the department detail from the request body
        // and create a new department in the database using the 
        // Department model and then return the response to the frontend

        const {dep_name , description} = req.body;
        const newDepartment = new Department({
            dep_name,
            description
        })
        // this will save the new department in the database and then return the response to the frontend
        await newDepartment.save();
        // if the department is added successfully then we will return the success response to the frontend with
        // the new added department detail in the response body
        return res.status(201).json({success:true,message:"Department added successfully", department: newDepartment});
    }
    catch(e){
        return res.status(500).json({success:false,message:"add department Server error"});    
    }

}

const editDepartemnt= async(req,res)=>{
    try{
      const {id} = req.params;
      const department = await Department.findById(id);
      if (!department) {
        return res.status(404).json({success:false,message:"Department not found"});
      }
      return res.status(200).json({success:true,department});
    }
    catch(e){
        return res.status(500).json({success:false,message:"add department Server error"});    
    }
}

const updateDepartment = async(req,res)=>{
    try{
      const {id} = req.params;
      const {dep_name, description} = req.body;
      const updateDep = await Department.findByIdAndUpdate(
        id,
        { dep_name, description, updatedAt: Date.now() },
        { new: true }
      );

      if (!updateDep) {
        return res.status(404).json({ success: false, message: "Department not found" });
      }

      return res.status(200).json({ success: true, department: updateDep });
    }
    catch(e){
       return res.status(500).json({success:false,message:"Edit department Server error"}); 
    }
}

const deleteDepartment = async(req, res)=>{
    try{
      const {id} = req.params;
      const deleteDep = await Department.findByIdAndDelete(id);

      if (!deleteDep) {
        return res.status(404).json({ success: false, message: "Department not found" });
      }

    return res.status(200).json({ success: true, department: deleteDep });
    }
    catch(e){
       return res.status(500).json({success:false,message:"delete department Server error"}); 
    }
}

export {addDepartment, getDepartments, editDepartemnt, updateDepartment, deleteDepartment};