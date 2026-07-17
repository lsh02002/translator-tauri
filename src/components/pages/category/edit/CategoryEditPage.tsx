import { useEffect, useState } from "react";
import { showToast } from "../../../form/toast/Toast";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate, useParams } from "react-router-dom";
import { CategoryType } from "../../../type/Type";

export default function CategoryEditPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true);

        const token = localStorage.getItem("accessToken");

        const category = await invoke<CategoryType>("get_domain_category", {
          token,
          categoryId: Number(categoryId),
        });

        setCategoryName(category.name);
        setDescription(category.description ?? "");
      } catch (e) {
        showToast(
          "카테고리 정보를 불러오는 중 오류가 발생했습니다.: " + String(e),
          "error",
        );
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId, navigate]);

  const handleSave = async () => {
    const trimmedName = categoryName.trim();

    if (!trimmedName) {
      showToast("카테고리 이름을 입력해 주세요.", "error");
      return;
    }

    if (!categoryId) {
      showToast("카테고리 ID가 없습니다.", "error");
      return;
    }

    try {
      setIsSubmitting(true);

      const token = localStorage.getItem("accessToken");

      await invoke("update_domain_category", {
        token,
        categoryId: Number(categoryId),
        request: {
          name: trimmedName,
          description: description.trim() || null,
        },
      });

      showToast("카테고리가 수정되었습니다.", "success");
      navigate(-1);
    } catch (e) {
      showToast("카테고리 수정 중 오류가 발생했습니다.: " + String(e), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <main className="min-vh-100 bg-light">
        <div className="p-4">
          <div className="d-flex justify-content-center align-items-center">
            <div className="text-center">
              <div
                className="spinner-border text-primary mb-3"
                role="status"
                aria-label="카테고리 정보를 불러오는 중"
              />
              <p className="text-secondary mb-0">
                카테고리 정보를 불러오는 중입니다.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-vh-100 bg-light">
      <div className="p-4">
        <div className="mx-auto">
          <header className="mb-4">
            <h1>카테고리 수정</h1>

            <p className="text-secondary mb-0">
              카테고리 이름과 설명을 수정하세요.
            </p>
          </header>

          <div className="mb-4">
            <label htmlFor="categoryName" className="form-label fw-semibold">
              카테고리 이름
            </label>

            <input
              id="categoryName"
              type="text"
              className="form-control"
              placeholder="예: 영어 학습 자료"
              value={categoryName}
              onChange={(event) => {
                setCategoryName(event.target.value);
              }}
              maxLength={50}
              disabled={isSubmitting}
              autoFocus
            />

            <div className="d-flex justify-content-end mt-1">
              <small className="text-secondary">{categoryName.length}/50</small>
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
              onChange={(event) => {
                setDescription(event.target.value);
              }}
              maxLength={200}
              disabled={isSubmitting}
            />

            <div className="text-end mt-1">
              <small className="text-secondary">{description.length}/200</small>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-light"
              disabled={isSubmitting}
              onClick={handleCancel}
            >
              취소
            </button>

            <button
              type="button"
              className="btn btn-primary px-4"
              disabled={isSubmitting || !categoryName.trim()}
              onClick={handleSave}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  />
                  저장 중
                </>
              ) : (
                "변경사항 저장"
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
