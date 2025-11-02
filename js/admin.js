/* KHỐI 1: HÀM KHỞI TẠO VÀ CHUNG */
function checkLogin() {
    let currentUser = JSON.parse(localStorage.getItem("currentuser"));
    if (!currentUser || currentUser.userType === 0) {
        alert("Bạn cần đăng nhập admin để truy cập trang này!");
        window.location.href = "index.html";
        return false;
    }

    const nameAcc = document.getElementById("name-acc");
    if (nameAcc) {
    nameAcc.innerHTML = currentUser.fullname;
  }
}

function setupTabs() {
    const sidebars = document.querySelectorAll(".sidebar-list-item.tab-content");
    const sections = document.querySelectorAll(".section");

    sidebars.forEach((sidebar, i) => {
        sidebar.onclick = function(e){
            e.preventDefault();
            document.querySelector(".sidebar-list-item.active").classList.remove("active");
            document.querySelector(".section.active").classList.remove("active");
            this.classList.add("active");
            sections[i + 1].classList.add("active"); 
        };
    });

    const dashboardTab = document.querySelector(".middle-sidebar .sidebar-list-item:first-child");
    if(dashboardTab){
        dashboardTab.onclick = function(e){
            e.preventDefault();
            document.querySelector(".sidebar-list-item.active").classList.remove("active");
            document.querySelector(".section.active").classList.remove("active");
            this.classList.add("active");
            sections[0].classList.add("active"); 
        };
    }

    const homeBtn = document.querySelector(".bottom-sidebar .sidebar-list-item:first-child a");
    if(homeBtn){
        homeBtn.onclick = function(e){
            e.preventDefault();
            dashboardTab.click(); 
        };
    }
}

function formatDate(date){
    if(!date) return "";
    let fm = new Date(date);
    let yyyy = fm.getFullYear();
    let mm = fm.getMonth() + 1;
    let dd = fm.getDate();
    if(dd < 10) dd = "0" + dd;
    if(mm < 10) mm = "0" + mm;
    return dd + "/" + mm + "/" + yyyy;
}

/* KHỐI 2: QUẢN LÝ KHÁCH HÀNG */

let updateAccount = document.getElementById("btn-update-account");

document.querySelector(".modal .modal-close").addEventListener("click", () => {
    document.querySelector(".modal").classList.remove("open");
    resetForm();
});

function resetForm() {
    document.getElementById("fullname").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("password").value = "";
    document.querySelector(".form-message-name").innerHTML = "";
    document.querySelector(".form-message-phone").innerHTML = "";
    document.querySelector(".form-message-password").innerHTML = "";
}

let indexFlag;
function editAccount(phone) {
    document.querySelector(".modal").classList.add("open");
    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    let index = accounts.findIndex((item) => item.phone == phone);
    if(index === -1) return;
    indexFlag = index;
    document.getElementById("fullname").value = accounts[index].fullname;
    document.getElementById("phone").value = accounts[index].phone;
    document.getElementById("password").value = accounts[index].password;
    document.getElementById("user-status").checked = accounts[index].status == 1;
}

updateAccount.addEventListener("click", (e) => {
    e.preventDefault();
    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    if(indexFlag === undefined) return;

    let fullname = document.getElementById("fullname").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let password = document.getElementById("password").value.trim();

    if(!fullname || !phone || !password){
        alert("Vui lòng nhập đầy đủ thông tin !");
        return;
    }

    accounts[indexFlag].fullname = fullname;
    accounts[indexFlag].phone = phone;
    accounts[indexFlag].password = password;
    accounts[indexFlag].status = document.getElementById("user-status").checked ? 1 : 0;
    localStorage.setItem("accounts", JSON.stringify(accounts));

    alert("Thay đổi thông tin thành công !");
    document.querySelector(".modal").classList.remove("open");
    resetForm();
    showUser();
});

function showUserArr(arr){
    let tbody = document.getElementById("show-user");
    if(!tbody) return;
    let accountHtml = "";

    if(arr.length === 0){
        accountHtml = `<td colspan="6" style="text-align: center;">Không có dữ liệu</td>`;
    }else{
        arr.forEach((account,index)=>{
            let tinhtrang = account.status==1? `<span style="color: green;">Hoạt động</span>` : `<span style="color: red;">Bị khóa</span>`;
            accountHtml += `
                <tr>
                    <td>${index+1}</td>
                    <td>${account.fullname}</td>
                    <td>${account.phone}</td>
                    <td>${formatDate(account.join)}</td>
                    <td>${tinhtrang}</td>
                    <td class="control control-table">
                        <button class="btn-edit" onclick="editAccount('${account.phone}')"><i class="fa-light fa-pen-to-square"></i></button>
                        <button class="btn-delete" onclick="deleteAccount('${account.phone}')"><i class="fa-regular fa-trash"></i></button>
                    </td>
                </tr>`;
        });
    }

    tbody.innerHTML = accountHtml;
}

function showUser(){
    const tinhTrangSelect = document.getElementById("tinh-trang-user");
    if(!tinhTrangSelect) return;
    let tinhTrang = parseInt(tinhTrangSelect.value);
    let ct = document.getElementById("form-search-user").value.toLowerCase();
    let timeStart = document.getElementById("time-start-user").value;
    let timeEnd = document.getElementById("time-end-user").value;

    if(timeEnd < timeStart && timeEnd && timeStart){
        alert("Lựa chọn thời gian sai !");
        return;
    }

    let accounts = JSON.parse(localStorage.getItem("accounts") || "[]").filter(a=>a.userType===0);
    let result = tinhTrang===2 ? accounts : accounts.filter(a=>a.status==tinhTrang);

    if(ct){
        result = result.filter(a=>a.fullname.toLowerCase().includes(ct) || a.phone.toString().includes(ct));
    }

    if(timeStart) result = result.filter(a=>new Date(a.join) >= new Date(timeStart).setHours(0,0,0));
    if(timeEnd) result = result.filter(a=>new Date(a.join) <= new Date(timeEnd).setHours(23,59,59));

    showUserArr(result);
}

function cancelSearchUser(){
    document.getElementById("tinh-trang-user").value = 2;
    document.getElementById("form-search-user").value = "";
    document.getElementById("time-start-user").value = "";
    document.getElementById("time-end-user").value = "";
    showUser();
}

function deleteAccount(phone){
    let accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
    let index = accounts.findIndex(a=>a.phone===phone);
    if(index===-1) return alert("Không tìm thấy tài khoản để xóa!");
    if(confirm("Bạn có chắc muốn xóa tài khoản " + accounts[index].fullname + "?")){
        accounts.splice(index,1);
        localStorage.setItem("accounts", JSON.stringify(accounts));
        showUser();
    }
}

document.getElementById("logout-acc").addEventListener("click",(e)=>{
    e.preventDefault();
    if(confirm("Bạn có chắc chắn muốn đăng xuất?")){
        localStorage.removeItem("currentuser");
        window.location.href = "index.html";
    }
});

/* KHỐI 3: KHỞI CHẠY CHÍNH  */
window.addEventListener("load", ()=>{
    checkLogin();
    setupTabs();
    showUser();
    const resetButton = document.querySelector(".btn-reset-order");
    if(resetButton) resetButton.addEventListener("click", cancelSearchUser);
});
