import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import AdminMenu from "../../components/nav/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import CategoryForm from "../../components/forms/CategoryForm";
import { Modal } from "antd";

export default function AdminCategory() {
    // context
    const [auth, setAuth] = useAuth();
    // state
    const [name, setName] = useState("");
    const [ageCategories, setAgeCategories] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(null);
    const [updatingName, setUpdatingName] = useState("");

    useEffect(() => {
        loadAgeCategories();
    }, []);

    const loadAgeCategories = async () => {
        try {
            const { data } = await axios.get("/agecategories");
            setAgeCategories(data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/ageCategory", { name });
            if (data?.error) {
                toast.error(data.error);
            } else {
                loadAgeCategories();
                setName("");
                toast.success(`"${data.name}" is created`);
            }
        } catch (err) {
            console.log(err);
            toast.error("Create category failed. Try again.");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`/ageCategory/${selected._id}`, {
                name: updatingName,
            });
            if (data?.error) {
                toast.error(data.error);
            } else {
                toast.success(`"${data.name}" is updated`);
                setSelected(null);
                setUpdatingName("");
                loadAgeCategories();
                setVisible(false);
            }
        } catch (err) {
            console.log(err);
            toast.error("Category may already exist. Try again.");
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.delete(`/ageCategory/${selected._id}`);
            if (data?.error) {
                toast.error(data.error);
            } else {
                toast.success(`"${data.name}" is deleted`);
                setSelected(null);
                loadAgeCategories();
                setVisible(false);
            }
        } catch (err) {
            console.log(err);
            toast.error("Category may already exist. Try again.");
        }
    };

    return (
        <>
            <Jumbotron
                title={`Hello ${auth?.user?.firstName}`}
                directory={"Admin Dashboard"}
                subDirectory={"Product Category Management"}
            />
            <div style={{ maxWidth: "1170px" }} className="container-fluid">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="p-3 mt-2 mb-2 h4 bg-light">
                            Manage Product ageCategories
                        </div>
                        <div>
                            <ageCategoryForm
                                value={name}
                                setValue={setName}
                                handleSubmit={handleSubmit}
                            />

                            <hr />

                            <div className="col">
                                {ageCategories?.map((c) => (
                                    <button
                                        key={c._id}
                                        className="btn btn-outline-primary m-3"
                                        onClick={() => {
                                            setVisible(true);
                                            setSelected(c);
                                            setUpdatingName(c.name);
                                        }}
                                    >
                                        {c.name}
                                    </button>
                                ))}
                            </div>

                            <Modal
                                visible={visible}
                                onOk={() => setVisible(false)}
                                onCancel={() => setVisible(false)}
                                footer={null}
                            >
                                <ageCategoryForm
                                    value={updatingName}
                                    setValue={setUpdatingName}
                                    handleSubmit={handleUpdate}
                                    buttonText="Update"
                                    handleDelete={handleDelete}
                                />
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
