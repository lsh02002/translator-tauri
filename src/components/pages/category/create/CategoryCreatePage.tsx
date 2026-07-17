import { useState } from "react";
import { showToast } from "../../../form/toast/Toast";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";

export default function CategoryCreatePage() {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken");
      await invoke("create_domain_category", {
        token,
        request: {
          name: categoryName,
          description: description || null,
        },
      });

      setCategoryName("");
      setDescription("");
      showToast("카테고리가 생성되었습니다.", "success");
      navigate(-1);
    } catch (e) {
      showToast("카테고리 생성 중 오류가 발생했습니다.: " + String(e), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-vh-100 bg-light">
      <div className="container py-5">
        <div className="mx-auto" style={{ maxWidth: "560px" }}>
          <header className="mb-4">
            <h1 className="h3 fw-bold mb-2">새 카테고리</h1>

            <p className="text-secondary mb-0">
              파일을 정리할 카테고리를 만들어 보세요.
            </p>
          </header>

          <div className="card-body p-4">
            <div className="mb-4">
              <label htmlFor="categoryName" className="form-label fw-semibold">
                카테고리 이름
              </label>

              <input
                id="categoryName"
                type="text"
                className={`form-control`}
                placeholder="예: 영어 학습 자료"
                value={categoryName}
                onChange={(event) => {
                  setCategoryName(event.target.value);
                }}
                maxLength={50}
                autoFocus
              />

              <div className="invalid-feedback">
                카테고리 이름을 입력해 주세요.
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="form-label fw-semibold">
                설명
                <span className="text-secondary fw-normal ms-1">선택</span>
              </label>

              <textarea
                id="description"
                className="form-control"
                rows={4}
                placeholder="카테고리에 대한 간단한 설명"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={200}
              />

              <div className="text-end mt-1">
                <small className="text-secondary">
                  {description.length}/200
                </small>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-light"
                disabled={isSubmitting}
                onClick={() => {
                  setCategoryName("");
                  setDescription("");
                }}
              >
                취소
              </button>

              <button
                type="button"
                className="btn btn-primary px-4"
                disabled={isSubmitting}
                onClick={handleSave}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      aria-hidden="true"
                    />
                    생성 중
                  </>
                ) : (
                  "카테고리 만들기"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
