import './styles.css';
import { useState, useEffect, useRef } from 'react';



export default function App() {
  const [bookmarks, setBookmarks] = useState([]); // bookmarks an empty array

  const [formData, setFormData] = useState({ // empty strings for all fields
    name: "",
    url: ""
  });

  // Index

const getBookmarks = async () => {
  try {
    const response = await fetch("http://localhost:8800/bookmarks");
    const data = await response.json();
    setBookmarks([...data]);
    console.log(bookmarks);
    
  } catch (error) {
    console.error(error);
  }
};

  // Create
  const createBookmark = async (e) => {
    e.preventDefault();
    const body = { ...formData}; // spreads form data into body
    try{
      const response = await fetch ("http://localhost:8800/bookmarks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body), // puts quotes around key and value so it's like a JSON obj
      });
      setFormData({ // clear out the form
        title: "",
        url: "",
      });

    }catch (error) {
      console.error(error);
    } finally {
      await getBookmarks();
    }
  };

  /* Form Functions */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target});
  }
/* 
//might eventually use this 
  const handleCheckBox = (e) => {
    const checkedValue = checkbox.current.checked;
    setFormData({ ...formData, isReadyToEat: checkedValue});
  }
*/



// Update
const updateBookmark = async (e, id) => {
  try {
    const response = await fetch(`http://localhost:8800/bookmarks/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(/* updated form data */)
    });
    const data = await response.json();
  }catch (error) {
    console.error(error);
  } finally {
    await getBookmarks();
  }
};

// Delete 
const deleteBookmark = async (e, id) => {
  try{
    const response = await fetch(`http://localhost:8800/bookmarks/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
    });
    const data = await response.json(); // the deleted bookmark
    // console.log ("response: ", response);
    // console.log ("data: ", data);
  } catch (error) {
    console.error(error);
  } finally {
    await getBookmarks();
  }
}

useEffect(() => {
  getBookmarks();
}, []);

  return (
    <div className="App">
      <header>Bookmarks</header>

      <form onSubmit={createBookmark}>
        <h3>Add a new bookmark</h3>

        <div id="input-holder">
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={handleChange}
            placeholder={"website"} 
            ></input>
          
          <input
            type="text"
            id="url"
            value={formData.url}
            onChange={handleChange}
            placeholder={"http://"} 
            ></input>

          <input type="submit"></input>
        </div>
      </form>
      
     <div id="bookmark-list">
       {bookmarks.map((bookmark, i) => {
        return (
          <div className="single-bookmark" key={bookmark._id}>
            <h3>{bookmark.title}</h3>
            <h3 className= "delete-button-x"
              onClick={(e) => {
                deleteBookmark(e, bookmark._id);
              }}
            >X</h3>
          </div>
        )})
        
      }
     
     </div>  
    </div>
  )}