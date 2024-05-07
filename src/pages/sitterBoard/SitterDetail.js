import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSitterBoard,
  updateSitterBoard,
  deleteSitterBoard,
  getCategories,
  getProvinces,
  getDistricts,
  getSitterComments,
  registerSitterComment,
  registerSitterReply,
  updateSitterComment,
  deleteSitterComment,
} from "../../api/sitterBoard";
import { useDispatch, useSelector } from "react-redux";
import { userSave } from "../../store/user";
import { Form, Button } from "react-bootstrap";
import styled from "styled-components";

const Div = styled.div`
  width: 90%;
  margin: auto;

  h1 {
    margin-bottom: 100px;
  }

  .board-area {
    width: 100%;
    display: flex;
    margin-bottom: 40px;
    flex-direction: column;
    align-items: center;

    .title-btns {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-bottom: 2px solid gray;

      .category-title {
        display: flex;
        align-items: center;

        .board-category {
          font-size: 1.2rem;
          background: purple;
          color: white;
          padding: 3px 10px;
          border-radius: 5px;
          margin-right: 15px;
        }
        .board-title {
          font-size: 2rem;
          font-weight: bold;
        }
      }

      .board-btns {
        display: flex;
        justify-content: space-between;
        width: 130px;

        button {
          width: 60px;
          height: 40px;
          background: black;
          color: white;
          border-radius: 5px;
        }
      }
    }

    .writer-date {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 15px;

      .writer {
        font-weight: bold;
      }
    }

    .animal-location {
      width: 100%;
      padding: 40px 15px 20px 15px;
      display: flex;
      justify-content: space-between;
      font-size: 1.2rem;
      text-align: center;

      .animal-category {
        width: 50%;
        display: flex;
        flex-direction: row;
      }

      .location {
        width: 50%;
        display: flex;
        flex-direction: row;
      }

      #title {
        padding-right: 20px;
        margin-right: 20px;
        font-weight: bold;
        border-right: 2px solid gray;
      }
    }

    .content-image {
      width: 100%;
      padding: 15px 20px;
      margin-bottom: 30px;
      border: 1px solid gray;
      border-radius: 5px;

      .board-content {
        height: 300px;
        font-size: 1.2rem;
      }

      .image {
        border-top: 1px solid lightgray;
        img {
          height: 200px;
          padding: 0 10px;
          margin-top: 20px;
        }
      }
    }
  }

  .comment-area {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .comment-list {
      width: 95%;
      margin-bottom: 10px;

      .each-comment {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        border-bottom: 1px solid lightgray;

        .user-date {
          display: flex;
          align-items: center;

          #comment-user {
            margin-right: 10px;
            font-weight: bold;
          }
          #comment-date {
            font-size: 15px;
            color: gray;
          }
        }

        #comment-content {
          margin-bottom: 0;
        }

        .comment-btns {
          width: 130px;
          display: flex;
          justify-content: space-between;

          button {
            width: 60px;
            margin-left: 10px;
          }
        }
      }
      .each-comment:hover {
        background: lightgray;
        border-radius: 5px;
      }
    }
  }

  .comment-input {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin: auto;
    margin-bottom: 30px;
  }

  .input {
    width: 88%;
    height: 40px;
  }
  button {
    width: 10%;
    height: 40px;
    background: black;
    color: white;
    border-radius: 5px;
    cursor: pointer;
  }
`;

const SitterDetail = () => {
  const { code } = useParams();
  const [sitterBoard, setSitterBoard] = useState({});
  const [user, setUser] = useState({});
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [commentEdit, setCommentEdit] = useState(null);
  const [commentEditCode, setCommentEditCode] = useState(0);
  const [commentEditContent, setCommentEditConent] = useState("");
  const [replyCode, setReplyCode] = useState(0);
  const [replyContent, setReplyContent] = useState("");

  // ================= 유저정보 =================
  const userInfo = useSelector((state) => {
    return state.user;
  });

  const sitterBoardAPI = async () => {
    const result = await getSitterBoard(code);
    console.log(result.data);
    setSitterBoard(result.data);
  };

  const sitterCommentsAPI = async () => {
    const result = await getSitterComments(code);
    console.log(result.data);
    setComments(result.data);
  };

  useEffect(() => {
    if (token !== null) {
      dispatch(userSave(JSON.parse(localStorage.getItem("user"))));
    }
    sitterBoardAPI(code);
    sitterCommentsAPI();
    if (Object.keys(userInfo).length === 0) {
      setUser(JSON.parse(localStorage.getItem("user")));
    } else {
      setUser(userInfo);
    }
  }, []);

  // ================= 댓글 등록 =================
  const registerComment = async () => {
    if (token === null) {
      alert("로그인이 필요합니다.");
    } else {
      await registerSitterComment({
        sitterBoardCode: code,
        sitterCommentContent: comment,
        user: {
          userId: user.userId,
        },
      });
      setComment("");
      sitterCommentsAPI();
    }
  };

  // ================= 댓글 삭제 =================
  const deleteComment = async (code) => {
    await deleteSitterComment(code);
    sitterCommentsAPI();
  };

  // ================= 댓글 수정 =================
  // // 목록에서 수정버튼 선택
  // const updateComment = async (comment) => {
  //   setCommentEdit(comment);
  // };

  // // 수정화면에서 취소버튼 선택
  // const cancelEdit = () => {
  //   setCommentEdit(null);
  // };

  // 수정화면에서 완료버튼 선택
  const commentUpdate = async () => {
    await updateSitterComment({
      sitterCommentCode: commentEditCode,
      sitterCommentContent: commentEditContent,
    });
    // setReplyContent("");
    setCommentEditCode(0);
    sitterCommentsAPI();
  };

  // ================= 게시글 수정 =================
  const updateBoard = () => {
    navigate("/compagno/sitterBoard/edit/" + code);
  };

  // ================= 게시글 삭제 =================
  const deleteBoard = async () => {
    await deleteSitterBoard(code);
    alert("게시글이 삭제됐습니다.");
    navigate("/compagno/sitterBoard");
  };

  return (
    <Div>
      <h1>Detail</h1>

      <div className="board-area" key={sitterBoard.sitterBoardCode}>
        <div className="title-btns">
          <div className="category-title">
            <div className="board-category">
              {sitterBoard.sitterCategory?.sitterCategoryType}
            </div>
            <div className="board-title">{sitterBoard.sitterTitle}</div>
          </div>
          <div className="board-btns">
            <button
              onClick={() => {
                deleteBoard();
              }}
            >
              삭제
            </button>
            <button
              onClick={() => {
                updateBoard();
              }}
            >
              수정
            </button>
          </div>
        </div>

        <div className="writer-date">
          <div className="writer">{sitterBoard.user?.userId}</div>
          <div className="register-date">
            <span>작성일 : </span>
            {`${new Date(sitterBoard.sitterRegiDate).getFullYear()}-${new Date(
              sitterBoard.sitterRegiDate
            ).getMonth()}-${new Date(sitterBoard.sitterRegiDate).getDate()}`}
          </div>
        </div>

        <div className="animal-location">
          <div className="animal-category">
            <div id="title">반려동물 종류</div>
            <div id="content">{sitterBoard.animalCategoryCode?.animalType}</div>
          </div>
          <div className="location">
            <div id="title">장소</div>
            <div id="content">
              {sitterBoard.location?.parent?.locationName}{" "}
              {sitterBoard.location?.locationName}
            </div>
          </div>
        </div>

        <div className="content-image">
          <div className="board-content">{sitterBoard.sitterContent}</div>
          <div className="image">
            {sitterBoard.images?.map((image) => (
              <img
                key={sitterBoard.sitterImgCode}
                src={"http://localhost:8081" + image.sitterImg}
              ></img>
            ))}
          </div>
        </div>
      </div>

      <div className="comment-area">
        <div className="comment-list">
          {comments?.map((comment) => (
            <div key={comment.sitterCommentCode} className="each-comment">
              <div className="user-date-content">
                <div className="user-date">
                  <span id="comment-user">{comment.user?.userId}</span>
                  <span id="comment-date">
                    {`${new Date(
                      comment.sitterCommentRegiDate
                    ).getFullYear()}-${new Date(
                      comment.sitterCommentRegiDate
                    ).getMonth()}-${new Date(
                      comment.sitterCommentRegiDate
                    ).getDate()}`}
                  </span>
                </div>
                <p id="comment-content">{comment.sitterCommentContent}</p>
              </div>
              {user.userId === comment.user?.userId && (
                <div className="comment-btns">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      commentUpdate();
                    }}
                  >
                    수정
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteComment(comment.sitterCommentCode);
                    }}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="comment-input">
          <Form.Control
            as="input"
            placeholder="댓글작성"
            value={comment}
            className="input"
            onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={registerComment}>등록</button>
        </div>
      </div>
    </Div>
  );
};

export default SitterDetail;
