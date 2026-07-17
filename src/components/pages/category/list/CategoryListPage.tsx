import { invoke } from "@tauri-apps/api/core";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../form/toast/Toast";
import { CategoryType } from "../../../type/Type";

export default function CategoryListPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const result = await invoke<CategoryType[]>("get_domain_categories", {
          token,
        });

        console.log(result);

        setCategories(result);
      } catch (e) {
        showToast(
          "카테고리 데이터를 불러오는 데 실패했습니다.: " + String(e),
          "error",
        );
      }
    })();
  }, []);

  return (
    <main className="min-vh-100 bg-light">
      <div className="container py-5">
        <header className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-4 mb-5">
          <div>
            <div className="d-flex align-items-center gap-2 text-primary fw-semibold small mb-2">
              <span
                className="rounded-circle bg-primary"
                style={{ width: 8, height: 8 }}
              />
              Workspace
            </div>

            <h1 className="display-6 fw-bold mb-2">내 카테고리</h1>

            <p className="text-secondary mb-0">
              카테고리와 파일을 한곳에서 관리하고 필요한 자료를 빠르게
              찾아보세요.
            </p>
          </div>

          <div className="d-flex flex-column flex-sm-row gap-2">
            <div className="input-group" style={{ minWidth: 280 }}>
              <span className="input-group-text bg-white border-end-0 text-secondary">
                <i className="bi bi-search" />
              </span>

              <input
                type="search"
                className="form-control border-start-0 ps-0"
                placeholder="파일 또는 카테고리 검색"
                aria-label="파일 또는 카테고리 검색"
              />
            </div>

            <button
              type="button"
              className="btn btn-primary d-inline-flex align-items-center justify-content-center gap-2 px-4"
              onClick={() => navigate("/categories/create")}
            >
              <i className="bi bi-plus" />
            </button>
          </div>
        </header>

        <section className="mb-5" aria-labelledby="folder-heading">
          <div className="d-flex align-items-end justify-content-between mb-3">
            <div>
              <h2 id="folder-heading" className="h5 fw-bold mb-1">
                카테고리
              </h2>

              <p className="small text-secondary mb-0">
                총 {categories.length}개의 카테고리
              </p>
            </div>

            <button
              type="button"
              className="btn btn-link text-decoration-none fw-semibold p-0"
            >
              전체 보기
            </button>
          </div>

          <div className="row g-4">
            {categories.map((category) => (
              <div key={category.id} className="col-12 col-md-6 col-xl-3">
                <article className="card h-100 border-0 shadow-sm category-card">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-3 bg-primary-subtle text-primary"
                        style={{
                          width: 52,
                          height: 52,
                        }}
                      >
                        <i className="bi bi-folder" />
                      </div>

                      <button
                        type="button"
                        className="btn btn-sm btn-light text-secondary"
                        aria-label={`${category.name} 카테고리 메뉴`}
                        onClick={() =>
                          navigate(`/categories/${category.id}/edit`)
                        }
                      >
                        <i className="bi bi-three-dots" />
                      </button>
                    </div>

                    <h3 className="h5 fw-bold mb-2">{category.name}</h3>

                    <p className="small text-secondary mb-4">
                      {category.description}
                    </p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
