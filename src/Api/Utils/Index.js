import axios from 'axios'

// Image upload
export const imageUpload = async image => {
  const formData = new FormData()
  formData.append('image', image)
  const { data } = await axios.post(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMMGBB_API}`,
    formData
  )
  return data.data.display_url
}