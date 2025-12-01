// DOM Elements
        const loginPage = document.getElementById('loginPage');
        const dashboardPage = document.getElementById('dashboardPage');
        const loginForm = document.getElementById('loginForm');
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        const attendanceSection = document.getElementById('attendanceSection');
        const assessmentSection = document.getElementById('assessmentSection');
        const modulesSection = document.getElementById('modulesSection');
        const certificatesSection = document.getElementById('certificatesSection');
        const logoutBtn = document.getElementById('logoutBtn');
        const saveAttendanceBtns = document.querySelectorAll('.save-attendance');
        const addAssessmentForm = document.getElementById('addAssessmentForm');
        const saveAssessmentBtn = document.getElementById('saveAssessmentBtn');
        const uploadModuleForm = document.getElementById('uploadModuleForm');
        const uploadModuleBtn = document.getElementById('uploadModuleBtn');
        const moduleFileInput = document.getElementById('moduleFile');
        const fileInfo = document.getElementById('fileInfo');
        const generateCertificateBtns = document.querySelectorAll('.generate-certificate');
        const downloadCertificateBtn = document.getElementById('downloadCertificateBtn');
        const deleteAssessmentBtns = document.querySelectorAll('.delete-assessment');
        const deleteModuleBtns = document.querySelectorAll('.delete-module');

        // Show Toast Notification
        function showToast(message, type = 'success') {
            const toastContainer = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = `custom-toast toast-${type}`;
            
            const icon = type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill';
            
            toast.innerHTML = `
                <div class="toast-icon">
                    <i class="bi ${icon}"></i>
                </div>
                <div class="toast-message">${message}</div>
            `;
            
            toastContainer.appendChild(toast);
            
            setTimeout(() => {
                toast.style.animation = 'slideIn 0.3s ease-out reverse';
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, 3000);
        }

        // Login Form Handler
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Simple validation for demo
            if (username === 'instructor1' && password === 'password1') {
                loginPage.style.display = 'none';
                dashboardPage.style.display = 'block';
                showToast('Login berhasil! Selamat datang di Portal Instruktur.');
            } else {
                showToast('Username atau password salah. Silakan coba lagi.', 'error');
            }
        });

        // Sidebar Navigation
        sidebarItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all items
                sidebarItems.forEach(i => i.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Get the section to show
                const section = this.getAttribute('data-section');
                
                // Hide all sections
                attendanceSection.classList.add('d-none');
                assessmentSection.classList.add('d-none');
                modulesSection.classList.add('d-none');
                certificatesSection.classList.add('d-none');
                
                // Show the selected section
                if (section === 'attendance') {
                    attendanceSection.classList.remove('d-none');
                } else if (section === 'assessment') {
                    assessmentSection.classList.remove('d-none');
                } else if (section === 'modules') {
                    modulesSection.classList.remove('d-none');
                } else if (section === 'certificates') {
                    certificatesSection.classList.remove('d-none');
                }
            });
        });

        // Logout Handler
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Reset form
            loginForm.reset();
            
            // Show login page and hide dashboard
            dashboardPage.style.display = 'none';
            loginPage.style.display = 'flex';
            
            // Reset sidebar navigation
            sidebarItems.forEach(item => item.classList.remove('active'));
            sidebarItems[0].classList.add('active');
            
            // Reset sections
            attendanceSection.classList.remove('d-none');
            assessmentSection.classList.add('d-none');
            modulesSection.classList.add('d-none');
            certificatesSection.classList.add('d-none');
            
            showToast('Anda telah keluar dari sistem.');
        });

        // Save Attendance Handler
        saveAttendanceBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const row = this.closest('tr');
                const studentName = row.querySelector('.attendance-select').getAttribute('data-student');
                const attendanceStatus = row.querySelector('.attendance-select').value;
                
                if (!attendanceStatus) {
                    showToast('Silakan pilih status kehadiran terlebih dahulu.', 'error');
                    return;
                }
                
                // Update session count if present
                if (attendanceStatus === 'present') {
                    const sessionCell = row.cells[2];
                    const currentSessions = parseInt(sessionCell.textContent);
                    sessionCell.textContent = currentSessions + 1;
                    
                    // Update progress bar
                    const progressBar = row.querySelector('.student-progress-bar');
                    const totalSessions = parseInt(row.cells[3].textContent);
                    const newProgress = ((currentSessions + 1) / totalSessions) * 100;
                    progressBar.style.width = `${newProgress}%`;
                    
                    showToast(`Absensi untuk ${studentName} berhasil disimpan. Sesi ditambahkan.`);
                } else {
                    showToast(`Absensi untuk ${studentName} berhasil disimpan.`);
                }
                
                // Reset the select
                row.querySelector('.attendance-select').value = '';
            });
        });

        // Save Assessment Handler
        saveAssessmentBtn.addEventListener('click', function() {
            const type = document.getElementById('assessmentType').value;
            const title = document.getElementById('assessmentTitle').value;
            const className = document.getElementById('assessmentClass').value;
            const date = document.getElementById('assessmentDate').value;
            const time = document.getElementById('assessmentTime').value;
            
            if (!title || !date || !time) {
                showToast('Mohon lengkapi semua field yang diperlukan.', 'error');
                return;
            }
            
            // Get the appropriate tab content
            let tabContent;
            if (type === 'quiz') {
                tabContent = document.querySelector('#quiz');
            } else if (type === 'exam') {
                tabContent = document.querySelector('#exam');
            } else {
                tabContent = document.querySelector('#practical');
            }
            
            // Create new assessment card
            const newCard = document.createElement('div');
            newCard.className = 'assessment-card';
            newCard.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5>${title}</h5>
                        <p class="mb-1">Kelas: ${className}</p>
                        <p class="mb-0">Tanggal: ${date}, ${time}</p>
                    </div>
                    <div>
                        <span class="badge-warning-custom">Terjadwal</span>
                        <button class="btn btn-sm btn-outline-primary ms-2 edit-assessment">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger ms-1 delete-assessment">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            // Add to the appropriate tab
            tabContent.appendChild(newCard);
            
            // Close modal and reset form
            const modal = bootstrap.Modal.getInstance(document.getElementById('addAssessmentModal'));
            modal.hide();
            addAssessmentForm.reset();
            
            showToast('Assessment berhasil ditambahkan.');
            
            // Add event listeners to new buttons
            const newDeleteBtn = newCard.querySelector('.delete-assessment');
            newDeleteBtn.addEventListener('click', function() {
                if (confirm('Apakah Anda yakin ingin menghapus assessment ini?')) {
                    newCard.remove();
                    showToast('Assessment berhasil dihapus.');
                }
            });
        });

        // Module File Input Handler
        moduleFileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                const fileName = this.files[0].name;
                const fileSize = (this.files[0].size / 1024).toFixed(2);
                fileInfo.textContent = `File: ${fileName} (${fileSize} KB)`;
            } else {
                fileInfo.textContent = '';
            }
        });

        // Upload Module Handler
        uploadModuleBtn.addEventListener('click', function() {
            const title = document.getElementById('moduleTitle').value;
            const className = document.getElementById('moduleClass').value;
            const file = document.getElementById('moduleFile').files[0];
            
            if (!title || !file) {
                showToast('Mohon lengkapi semua field yang diperlukan.', 'error');
                return;
            }
            
            // Determine file icon based on extension
            let fileIcon = 'bi-file-earmark';
            const fileName = file.name;
            if (fileName.endsWith('.pdf')) {
                fileIcon = 'bi-file-earmark-pdf';
            } else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
                fileIcon = 'bi-file-earmark-word';
            }
            
            // Create new module card
            const newCard = document.createElement('div');
            newCard.className = 'module-card';
            newCard.innerHTML = `
                <div class="module-info">
                    <div class="module-icon">
                        <i class="bi ${fileIcon}"></i>
                    </div>
                    <div>
                        <h5>${title}</h5>
                        <p class="mb-0">Diunggah: ${new Date().toLocaleDateString('id-ID')}</p>
                    </div>
                </div>
                <div>
                    <button class="btn btn-sm btn-outline-primary me-2">
                        <i class="bi bi-eye"></i> Lihat
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-module">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
            
            // Add to modules section
            modulesSection.querySelector('.row .col-md-12').appendChild(newCard);
            
            // Close modal and reset form
            const modal = bootstrap.Modal.getInstance(document.getElementById('uploadModuleModal'));
            modal.hide();
            uploadModuleForm.reset();
            fileInfo.textContent = '';
            
            showToast('Modul berhasil diunggah.');
            
            // Add event listener to new delete button
            const newDeleteBtn = newCard.querySelector('.delete-module');
            newDeleteBtn.addEventListener('click', function() {
                if (confirm('Apakah Anda yakin ingin menghapus modul ini?')) {
                    newCard.remove();
                    showToast('Modul berhasil dihapus.');
                }
            });
        });

        // Generate Certificate Handler
        generateCertificateBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const card = this.closest('.certificate-card');
                const studentName = card.querySelector('h5').textContent;
                const className = card.querySelector('p.mb-1').textContent.replace('Kelas: ', '');
                const totalSessions = card.querySelector('p.mb-0.mt-1').textContent.match(/\d+/)[0];
                
                // Update certificate preview
                document.getElementById('certificateStudentName').textContent = studentName;
                document.getElementById('certificateClassName').textContent = className;
                document.getElementById('certificateTotalSessions').textContent = totalSessions;
                document.getElementById('certificateDate').textContent = new Date().toLocaleDateString('id-ID');
                
                // Show modal
                const modal = new bootstrap.Modal(document.getElementById('certificatePreviewModal'));
                modal.show();
            });
        });

        // Download Certificate Handler
        downloadCertificateBtn.addEventListener('click', function() {
            showToast('Sertifikat berhasil diunduh.');
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('certificatePreviewModal'));
            modal.hide();
        });

        // Delete Assessment Handler
        deleteAssessmentBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                if (confirm('Apakah Anda yakin ingin menghapus assessment ini?')) {
                    const card = this.closest('.assessment-card');
                    card.remove();
                    showToast('Assessment berhasil dihapus.');
                }
            });
        });

        // Delete Module Handler
        deleteModuleBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                if (confirm('Apakah Anda yakin ingin menghapus modul ini?')) {
                    const card = this.closest('.module-card');
                    card.remove();
                    showToast('Modul berhasil dihapus.');
                }
            });
        });

        // Set current date for session date input
        document.getElementById('sessionDate').valueAsDate = new Date();
        
        // Set current date for assessment date input
        document.getElementById('assessmentDate').valueAsDate = new Date();