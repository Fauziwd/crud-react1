import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const initialData = [
    { id: 1, name: "Barang A", stock: 10, price: "Rp 0" },
    { id: 2, name: "Barang B", stock: 5, price: "Rp 0" },
    { id: 3, name: "Barang C", stock: 2, price: "Rp 0" },
  ];

  const [data, setData] = useState(() => {
    const localData = localStorage.getItem("data");
    return localData ? JSON.parse(localData) : initialData;
  });
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const handleAdd = () => {
    const newId = data.length + 1;
    const newItem = { id: newId, name: "Barang Baru", stock: 0, price: "Rp" };
    setData([...data, newItem]);
  
    toast.info('Barang berhasil ditambahkan', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme:"colored",
    });
  };
  

  const handleEdit = (id, name, stock, price) => {
    setEditId(id);
    setEditName(name);
    setEditStock(stock);
    setEditPrice(price);
  };

  const handleSave = () => {
    const newData = data.map((item) => {
      if (item.id === editId) {
        return { ...item, name: editName, stock: editStock, price: editPrice };
      } else {
        return item;
      }
    });

    setData(newData);
    setEditId(null);
    setEditName("");
    setEditStock("");
    setEditPrice("");

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });

    Toast.fire({
      icon: 'success',
      title: 'Data berhasil disimpan'
    });
  };

  const handleCancel = () => {
    setEditId(null);
    setEditName("");
    setEditStock("");
    setEditPrice("");
  };

  const handleDelete = (id) => {
    // Temukan data barang yang akan dihapus
    const itemToDelete = data.find((item) => item.id === id);
  
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: ` ${itemToDelete.name} akan dihapus secara permanen!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        const newData = data.filter((item) => item.id !== id);
        setData(newData);
        
        toast.error(`${itemToDelete.name} telah dihapus`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    });
  };   

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "name") {
      setEditName(value);
    } else if (name === "stock") {
      setEditStock(value);
    } else if (name === "price") {
      setEditPrice(value);
    }
  };

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(data));
  }, [data]);

  return (
    <div className="App">
      <h1>Daftar Barang</h1>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Barang</th>
            <th>Jumlah Stock</th>
            <th>Harga</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>
                {editId === item.id ? (
                  <input type="text" name="name" value={editName} onChange={handleChange} />
                ) : (
                  item.name
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <input type="number" name="stock" value={editStock} onChange={handleChange} />
                ) : (
                  item.stock
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <input type="text" name="price" value={editPrice} onChange={handleChange} />
                ) : (
                  item.price
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <>
                    <button className="save" onClick={handleSave}>Simpan</button>
                    <button onClick={handleCancel}>Batal</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(item.id, item.name, item.stock, item.price)}>Edit</button>
                )}
                <button className="delete" onClick={() => handleDelete(item.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="box" onClick={handleAdd}>Tambah Barang</button>
      <ToastContainer />
    </div>
  );
}

export default App;

