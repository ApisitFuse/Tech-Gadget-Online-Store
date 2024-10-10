import React from 'react';

// สร้าง component เพื่อควบคุมการมองเห็น
const RoleBasedComponent = ({ allowedRoles, userRole, children }) => {
    // ตรวจสอบว่า userRole อยู่ใน allowedRoles หรือไม่
    const isAuthorized = allowedRoles.includes(userRole);

    return (
        <>
            {isAuthorized ? children : null} {/* ถ้า authorized ให้แสดง children */}
        </>
    );
};

export default RoleBasedComponent;