import React, { useState, useEffect } from "react";
import List from "./Post/List.js";
import axios from "axios";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { GNBDiv, FooterDiv } from "../Style/MainPageCSS.js";

function MainPage() {
  const [PostList, setPostList] = useState([]);
  const [Sort, setSort] = useState("최신순");
  const [Search, setSearch] = useState("");
  const [Skip, setSkip] = useState(0);
  const [LoadMore, setLoadMore] = useState(true);

  const getLoadMore = () => {
    let body = {
      sort: Sort,
      search: Search,
      skip: Skip,
    };
    axios
      .post("/api/post/list", body)
      .then((res) => {
        if (res.data.success) {
          setPostList([...PostList, ...res.data.postList]);
          setSkip(Skip + res.data.postList.length);
          if (res.data.postList.length < 5) {
            setLoadMore(false);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPostList = () => {
    setSkip(0);
    let body = {
      sort: Sort,
      search: Search,
      skip: 0,
    };
    axios
      .post("/api/post/list", body)
      .then((res) => {
        if (res.data.success) {
          setPostList([...res.data.postList]);
          setSkip(res.data.postList.length);
          if (res.data.postList.length < 5) {
            setLoadMore(false);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getPostList();
  }, [Sort]);

  const SearchHandler = () => {
    getPostList();
  };

  return (
    <div>
      <GNBDiv>
        <div className="search">
          <input
            type="text"
            value={Search}
            onChange={(e) => {
              setSearch(e.target.value);
              SearchHandler();
            }}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                SearchHandler();
              }
            }}
          />
          <button onClick={() => SearchHandler()}>
            <i className="bi bi-search"></i>
          </button>
        </div>
        <DropdownButton variant="outline-secondary" title={Sort}>
          <Dropdown.Item onClick={() => setSort("최신순")}>
            최신순
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSort("인기순")}>
            인기순
          </Dropdown.Item>
        </DropdownButton>
      </GNBDiv>

      <List PostList={PostList} />
      {LoadMore && (
        <FooterDiv>
          <button
            style={{ marginBottom: "10vh" }}
            onClick={() => getLoadMore()}
          >
            더 불러오기
          </button>
        </FooterDiv>
      )}
    </div>
  );
}

export default MainPage;
