class DeleteProduct {
  constructor() {
    this.id = "";
  }
  async delete(id, cb) {
    const response = await fetch(process.env.DOMAIN + "user/deleteproduct", {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    });
    const data = await response.json();
    if (data.status == "success") {
      alert("delete succees");
      // window.location.reload();
    } else {
      alert("not delete");
    }
  }
}
export default new DeleteProduct();
