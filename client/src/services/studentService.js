import Http from "./httpService";
import config from "../../config.json";

// in this method we get all student list and create an object with datas we want
export async function getStud() {
    try {
        const data = await Http.get(config.api+"/student/getall");
        const user = data.data.result;
        let users = [];
        for(var i=0; i< user.length; i++){
          if(user[i].salt !== '')
            users.push(user[i]);
        }
        return users;
    } catch (error) {
        return [];
    }
}

// we put(update) the special student witch given by id
export async function UpdateStudent(obj,id) {
    try {
        await Http.put(config.api + '/student/' + id, obj);
    } catch (error) {
        
    }
}

export async function delStud(id) {
    try {
        await Http.delete(config.api + '/student/' + id);
    } catch (error) {
        
    }
}

export async function addStudToTerm(termId,id) {
    try {
        await Http.post(config.api + '/term/addStudentToTerm/' + id,termId);
    } catch (error) {
        
    }
}

export async function delStudFromTerm(termId,id) {
    try {
        await Http.post(config.api + '/term/removeStudentFromTerm/' + id,termId);
    } catch (error) {
        
    }
}

export async function getStudByPage(num) {
    try {
        const result = await Http.get(config.api + '/student/list?pagenumber='+ num + '&pagesize=5');
        const stud = result.data.result.students;
          let student = {stud:[],count:0};
          for(var i=0; i< stud.length; i++){
            if(stud[i].salt !== '')
                student.stud.push(stud[i]);
          }
          student.count = result.data.result.count;
        return student;
      } catch (error) {
        return [];
      }
}

export default{
    getStud,
    UpdateStudent,
    delStud,
    addStudToTerm,
    delStudFromTerm,
    getStudByPage
}