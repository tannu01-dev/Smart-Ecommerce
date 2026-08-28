import { useState } from "react";

function Coupons() {
  const [coupons, setCoupons] = useState([
    { id: 1, code: "SAVE10", type: "Percentage", value: 10, minOrder: 500, used: 24, status: "active", expiry: "30 Sep 2026" },
    { id: 2, code: "WELCOME50", type: "Fixed", value: 50, minOrder: 300, used: 12, status: "active", expiry: "15 Oct 2026" },
    { id: 3, code: "FESTIVE20", type: "Percentage", value: 20, minOrder: 1000, used: 89, status: "expired", expiry: "10 Aug 2026" }
  ]);

  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);

  const [code, setCode] = useState("");
  const [type, setType] = useState("Percentage");
  const [value, setValue] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [expiry, setExpiry] = useState("");

  const resetForm = () => {
    setCode("");
    setType("Percentage");
    setValue("");
    setMinOrder("");
    setExpiry("");
  };

  const openAdd = () => {
    resetForm();
    setModal("add");
  };

  const openEdit = (coupon) => {
    setSelected(coupon);
    setCode(coupon.code);
    setType(coupon.type);
    setValue(coupon.value);
    setMinOrder(coupon.minOrder);
    setExpiry(coupon.expiry);
    setModal("edit");
  };

  const saveCoupon = () => {
    if (!code || !value || !minOrder || !expiry) {
      alert("Please fill all fields");
      return;
    }

    if (modal === "add") {
      setCoupons([
        ...coupons,
        {
          id: Date.now(),
          code: code.toUpperCase(),
          type,
          value: Number(value),
          minOrder: Number(minOrder),
          used: 0,
          status: "active",
          expiry
        }
      ]);
    } else {
      setCoupons(
        coupons.map((coupon) =>
          coupon.id === selected.id
            ? {
                ...coupon,
                code: code.toUpperCase(),
                type,
                value: Number(value),
                minOrder: Number(minOrder),
                expiry
              }
            : coupon
        )
      );
    }

    setModal(null);
    resetForm();
  };

  const deleteCoupon = () => {
    setCoupons(
      coupons.filter((coupon) => coupon.id !== selected.id)
    );
    setModal(null);
    setSelected(null);
  };

  return (
    <div>
      <div className="admin-page-title">
        <div>
          <h1>Coupons</h1>
          <p>Create and manage discount coupons.</p>
        </div>

        <button className="add-category-btn" onClick={openAdd}>
          + Create Coupon
        </button>
      </div>

      <div className="coupons-table">
        <div className="coupons-header">
          <span>Code</span>
          <span>Discount</span>
          <span>Min Order</span>
          <span>Used</span>
          <span>Expiry</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {coupons.map((coupon) => (
          <div className="coupons-row" key={coupon.id}>
            <strong>{coupon.code}</strong>

            <span>
              {coupon.type === "Percentage"
                ? `${coupon.value}%`
                : `₹${coupon.value}`}
            </span>

            <span>₹{coupon.minOrder}</span>

            <span>{coupon.used}</span>

            <span>{coupon.expiry}</span>

            <span className={`coupon-status ${coupon.status}`}>
              {coupon.status}
            </span>

            <div className="category-actions">
              <button
                className="edit-btn"
                onClick={() => openEdit(coupon)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => {
                  setSelected(coupon);
                  setModal("delete");
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="modal-overlay">
          <div className="modal">

            <button
              className="modal-close"
              onClick={() => setModal(null)}
            >
              ×
            </button>

            {modal !== "delete" ? (
              <>
                <h2>
                  {modal === "add"
                    ? "Create Coupon"
                    : "Edit Coupon"}
                </h2>

                <label>Coupon Code</label>
                <input
                  className="category-input"
                  placeholder="SAVE20"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />

                <label>Discount Type</label>
                <select
                  className="category-input"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option>Percentage</option>
                  <option>Fixed</option>
                </select>

                <label>Discount Value</label>
                <input
                  className="category-input"
                  type="number"
                  placeholder="20"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />

                <label>Minimum Order</label>
                <input
                  className="category-input"
                  type="number"
                  placeholder="500"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                />

                <label>Expiry Date</label>
                <input
                  className="category-input"
                  type="date"
                  value={
                    expiry.includes(" ")
                      ? ""
                      : expiry
                  }
                  onChange={(e) => setExpiry(e.target.value)}
                />

                <div className="modal-actions">
                  <button
                    className="cancel-btn"
                    onClick={() => setModal(null)}
                  >
                    Cancel
                  </button>

                  <button
                    className="approve-btn"
                    onClick={saveCoupon}
                  >
                    {modal === "add"
                      ? "Create Coupon"
                      : "Save Changes"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2>Delete Coupon</h2>

                <p className="modal-message">
                  Are you sure you want to delete
                  <strong> {selected?.code}</strong>?
                </p>

                <div className="modal-actions">
                  <button
                    className="cancel-btn"
                    onClick={() => setModal(null)}
                  >
                    Cancel
                  </button>

                  <button
                    className="delete-confirm-btn"
                    onClick={deleteCoupon}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Coupons;