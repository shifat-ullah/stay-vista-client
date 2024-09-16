import { useState } from "react";
import AddRoomForm from "../../Form/AddRoomFrom";
import { toast } from 'react-hot-toast';
import { imageUpload } from "../../../../Api/Utils/Index";
import useAuth from './../../../../hooks/useAuth';
import useAxiosSecure from './../../../../hooks/useAxiosSecure';
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

const AddRoom = () => {
    const navigate = useNavigate()
    const axiosSecure = useAxiosSecure()
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState()
    const [imageText, setImageText] = useState('Upload Image')
    const { user } = useAuth()

    const [dates, setDates] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    })

    const handleDates = item => {
        console.log(item.selection)
        setDates(item.selection)

    }

    const { mutateAsync } = useMutation({
        mutationFn: async roomData => {
            const { data } = await axiosSecure.post(`/room`, roomData)
            return data
        },
        onSuccess: () => {
            console.log('Data Saved Successfully')
            toast.success('Room Added Successfully!')
            navigate('/dashboard/my-listings')
            setLoading(false)
        },
    })

    const handleSubmit = async e => {
        e.preventDefault()
        // setLoading(true)
        const form = e.target
        const location = form.location.value
        const category = form.category.value
        const title = form.title.value
        const to = dates.endDate
        const from = dates.startDate
        const price = form.price.value
        const guests = form.total_guest.value
        const bathrooms = form.bathrooms.value
        const description = form.description.value
        const bedrooms = form.bedrooms.value
        const image = form.image.files[0]

        const host = {
            name: user?.displayName,
            image: user?.photoURL,
            email: user?.email,
        }

        try {
            const image_url = await imageUpload(image)
            console.log(image_url)
            const roomData = {
                location,
                category,
                title,
                to,
                from,
                price,
                guests,
                bathrooms,
                bedrooms,
                host,
                description,
                image: image_url,
            }
            console.table(roomData)

            //   Post request to server
            await mutateAsync(roomData)

        } catch (err) {
            console.log(err)
            toast.error(err.message)
            // setLoading(false)
        }
    }

    const handleImage = image => {
        setImageText(image.name)
    }


    return (
        <div>
            <Helmet>
                <title>Add Room | Dashboard</title>
            </Helmet>
            {/* <div className='h-16 w-16 object-cover overflow-hidden flex items-center'>
                {imagePreview && <img src={imagePreview} />}
            </div> */}
            <AddRoomForm
                handleDates={handleDates}
                handleSubmit={handleSubmit}
                imagePreview={imagePreview}
                handleImage={handleImage}
                setImagePreview={setImagePreview}
                imageText={imageText}
                dates={dates}
                loading={loading}
            ></AddRoomForm>
        </div>
    );
};

export default AddRoom;