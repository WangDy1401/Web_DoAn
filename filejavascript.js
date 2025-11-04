<script>
        let orders = [
            { code: 'DH001', date: '2025-11-04', customer: 'A Phong', products: ['Chậu Hoa'], status: 'Đã xác nhận', total: 5500000 },
            { code: 'DH002', date: '2025-11-04', customer: 'A Toàn', products: ['Quà Noel', 'Chậu Noel'], status: 'Đang vận chuyển', total: 1200000 },
            { code: 'DH003', date: '2025-11-03', customer: 'A Thanh', products: ['Chậu Cây'], status: 'Chờ xử lý', total: 750000 }
        ];

        let inventory = [
            { code: 'SP01', name: 'Chậu Cây', current: 150, safety: 100 },
            { code: 'SP02', name: 'Chậu Noel', current: 25, safety: 30 },
            { code: 'SP03', name: 'Chậu Hoa', current: 5, safety: 10 },
            { code: 'SP04', name: 'Quà Noel', current: 70, safety: 50 }
        ];


        function formatCurrency(amount) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
        }

        // Quản lý đơn hàng
        function renderOrderTable(data = orders) {
            const tableBody = document.querySelector('#orderTable tbody');
            tableBody.innerHTML = '';
            data.forEach(order => {
                const row = tableBody.insertRow();
                row.insertCell().textContent = order.code;
                row.insertCell().textContent = new Date(order.date).toLocaleDateString('vi-VN');
                row.insertCell().textContent = order.customer;
                row.insertCell().innerHTML = order.products.join('<br>'); 
                row.insertCell().textContent = order.status;
                row.insertCell().textContent = formatCurrency(order.total);
                const actionsCell = row.insertCell();
                actionsCell.innerHTML = `
                    <select onchange="updateOrderStatus('${order.code}', this.value)">
                        <option value="${order.status}" selected disabled>${order.status}</option>
                        <option value="Chờ xử lý">Chờ xử lý</option>
                        <option value="Đã xác nhận">Đã xác nhận</option>
                        <option value="Đang vận chuyển">Đang vận chuyển</option>
                        <option value="Đã giao hàng">Đã giao hàng</option>
                    </select>
                `;
            });
        }

        function addOrder() {
            const code = document.getElementById('orderCode').value;
            const customer = document.getElementById('orderCustomer').value;
            const productsInput = document.getElementById('orderProductsInput').value;
            const total = parseFloat(document.getElementById('orderTotal').value);
            const status = document.getElementById('orderStatus').value;
            const today = new Date().toISOString().split('T')[0];

            if (!code || !customer || !productsInput || isNaN(total)) {
                alert('Vui lòng nhập đầy đủ thông tin đơn hàng!');
                return;
            }

            if (orders.some(o => o.code === code)) {
                alert('Mã đơn hàng đã tồn tại!');
                return;
            }
            
            const productsArray = productsInput.split(',').map(item => item.trim());

            orders.push({
                code: code,
                date: today,
                customer: customer,
                products: productsArray,
                status: status,
                total: total
            });

            document.getElementById('orderCode').value = '';
            document.getElementById('orderCustomer').value = '';
            document.getElementById('orderProductsInput').value = '';
            document.getElementById('orderTotal').value = '';

            renderOrderTable();
            alert(`Đơn hàng ${code} đã được thêm.`);
        }

        function updateOrderStatus(code, newStatus) {
            const orderIndex = orders.findIndex(o => o.code === code);
            if (orderIndex !== -1) {
                orders[orderIndex].status = newStatus;
                renderOrderTable();
                alert(`Đơn hàng ${code} đã cập nhật trạng thái thành: ${newStatus}`);
            }
        }
        function filterOrders() {
            const dateSearch = document.getElementById('searchDate').value;
            const status = document.getElementById('searchStatus').value;

            const filtered = orders.filter(order => {
                let passDate = true;
                let passStatus = true;

                if (dateSearch && order.date !== dateSearch) {
                    passDate = false;
                }
                if (status && order.status !== status) {
                    passStatus = false;
                }

                return passDate && passStatus;
            });

            renderOrderTable(filtered);
        }

        function resetOrderFilter() {
            document.getElementById('searchDate').value = '';
            document.getElementById('searchStatus').value = '';
            renderOrderTable(orders);
        }

        // QUản lý tồn kho
        function renderInventoryTable() {
            const tableBody = document.querySelector('#inventoryTable tbody');
            tableBody.innerHTML = '';

            inventory.forEach(product => {
                const row = tableBody.insertRow();
                const warning = product.current <= product.safety ?
                                product.current === 0 ? '<span style="color:red; font-weight:bold;">Hết hàng</span>' :
                                '<span style="color:orange; font-weight:bold;">Sắp hết hàng</span>' :
                                'Bình thường';

                row.insertCell().textContent = product.code;
                row.insertCell().textContent = product.name;
                row.insertCell().textContent = product.current;
                row.insertCell().textContent = product.safety;
                row.insertCell().innerHTML = warning;

                const actionsCell = row.insertCell();
                actionsCell.innerHTML = `
                    <button onclick="alert('Thống kê Nhập/Xuất của ${product.code}')">Thống Kê</button>
                    <button onclick="alert('Cập nhật số lượng của ${product.code}')">Cập Nhật SL</button>
                `;
            });
        }

        function addProduct() {
            const code = document.getElementById('productCode').value;
            const name = document.getElementById('productName').value;
            const current = parseInt(document.getElementById('currentStock').value);
            const safety = parseInt(document.getElementById('safetyStock').value);

            if (!code || !name || isNaN(current) || isNaN(safety)) {
                alert('Vui lòng nhập đầy đủ thông tin sản phẩm và số lượng hợp lệ!');
                return;
            }

            const productIndex = inventory.findIndex(p => p.code === code);

            if (productIndex !== -1) {
                inventory[productIndex].name = name;
                inventory[productIndex].current = current;
                inventory[productIndex].safety = safety;
                alert(`Sản phẩm ${code} đã được cập nhật.`);
            } else {
                inventory.push({ code, name, current, safety });
                alert(`Sản phẩm ${code} đã được thêm mới.`);
            }
            document.getElementById('productCode').value = '';
            document.getElementById('productName').value = '';
            document.getElementById('currentStock').value = '';
            document.getElementById('safetyStock').value = '';
            renderInventoryTable();
        }
        document.addEventListener('DOMContentLoaded', () => {
            renderOrderTable();
            renderInventoryTable();
        });

    </script>