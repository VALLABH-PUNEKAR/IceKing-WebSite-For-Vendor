import axios from "axios";
import api from "../../api";
import type { ProductForm } from "./ProductForm";
interface Data{
    
    form:ProductForm
    setForm:React.Dispatch<React.SetStateAction<ProductForm>>

}
export const handleUpload = async ({form,setForm}:Data) => {
    if (!form.image || !(form.image instanceof File)) return;
    const file=form.image
    try {
     
      const extension = file.name.split('.').pop();

      // 1. Get temporary upload URL from Spring Boot backend
      const res = await api.get("api/images/presigned-upload-url",{params:{extension}});
      
      const {uploadUrl,filePath}=res.data
      // 2. Upload file directly to Supabase using the signed URL
      const uploadRes=await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      });
      

      // 3. Send file path to backend to save in database
     return filePath

      alert('Upload sucessfull!');
    } catch (err) {
      console.error(err);
    } 
  };