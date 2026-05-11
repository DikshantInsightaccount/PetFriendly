-- =====================================================
-- Vet Clinic Database Schema (MySQL 8.0)
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;
SET sql_mode = 'STRICT_ALL_TABLES';

-- =====================================================
-- USERS
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('OWNER','VET','ADMIN') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =====================================================
-- VET DETAILS
-- =====================================================
CREATE TABLE IF NOT EXISTS vet_details (
    vet_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_vet_user
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_vet_details_user_id ON vet_details(user_id);

-- =====================================================
-- VET WORKING HOURS
-- =====================================================
CREATE TABLE IF NOT EXISTS vet_working_hours (
    working_hour_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vet_id BIGINT UNSIGNED NOT NULL,
    day_of_week ENUM('MON','TUE','WED','THU','FRI','SAT','SUN') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_working_hours_vet
        FOREIGN KEY (vet_id) REFERENCES vet_details(vet_id) ON DELETE CASCADE,
    CONSTRAINT chk_working_time CHECK (end_time > start_time)
) ENGINE=InnoDB;

CREATE INDEX idx_working_hours_vet_id ON vet_working_hours(vet_id);

-- =====================================================
-- VET BREAKS
-- =====================================================
CREATE TABLE IF NOT EXISTS vet_breaks (
    break_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vet_id BIGINT UNSIGNED NOT NULL,
    break_name VARCHAR(50),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_breaks_vet
        FOREIGN KEY (vet_id) REFERENCES vet_details(vet_id) ON DELETE CASCADE,
    CONSTRAINT chk_break_time CHECK (end_time > start_time)
) ENGINE=InnoDB;

CREATE INDEX idx_breaks_vet_id ON vet_breaks(vet_id);

-- =====================================================
-- PETS
-- =====================================================
CREATE TABLE IF NOT EXISTS pets (
    pet_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    type VARCHAR(50),
    breed VARCHAR(100),
    gender ENUM('MALE','FEMALE'),
    owner_id BIGINT UNSIGNED NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,            
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_pet_owner
        FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_pets_owner_id ON pets(owner_id);

-- =====================================================
-- APPOINTMENT TYPES
-- =====================================================
CREATE TABLE IF NOT EXISTS appointment_types (
    appointment_type_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    expected_duration INT NOT NULL CHECK (expected_duration > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =====================================================
-- DOCTOR APPOINTMENT TYPES
-- =====================================================
CREATE TABLE IF NOT EXISTS doctor_appointment_types (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vet_id BIGINT UNSIGNED NOT NULL,
    appointment_type_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dat_vet
        FOREIGN KEY (vet_id) REFERENCES vet_details(vet_id) ON DELETE CASCADE,
    CONSTRAINT fk_dat_type
        FOREIGN KEY (appointment_type_id)
        REFERENCES appointment_types(appointment_type_id),
    CONSTRAINT uq_vet_appt_type UNIQUE (vet_id, appointment_type_id)
) ENGINE=InnoDB;

-- =====================================================
-- DOCTOR SLOTS
-- =====================================================
CREATE TABLE IF NOT EXISTS doctor_slots (
    slot_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vet_id BIGINT UNSIGNED NOT NULL,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_slot_vet
        FOREIGN KEY (vet_id) REFERENCES vet_details(vet_id) ON DELETE CASCADE,
    CONSTRAINT chk_slot_time CHECK (end_time > start_time)
) ENGINE=InnoDB;

CREATE INDEX idx_slots_vet_id ON doctor_slots(vet_id);

-- =====================================================
-- APPOINTMENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pet_id BIGINT UNSIGNED NOT NULL,
    vet_id BIGINT UNSIGNED NOT NULL,
    owner_id BIGINT UNSIGNED NOT NULL,          
    appointment_type_id BIGINT UNSIGNED NOT NULL,
    slot_id BIGINT UNSIGNED UNIQUE NOT NULL,
    appointment_mode ENUM('ONLINE','OFFLINE') NOT NULL,
    status ENUM('BOOKED','COMPLETED','CANCELLED') NOT NULL DEFAULT 'BOOKED',
    actual_start_time TIMESTAMP NULL,
    actual_end_time TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_appt_pet FOREIGN KEY (pet_id) REFERENCES pets(pet_id),
    CONSTRAINT fk_appt_vet FOREIGN KEY (vet_id) REFERENCES vet_details(vet_id),
    CONSTRAINT fk_appt_type FOREIGN KEY (appointment_type_id)
        REFERENCES appointment_types(appointment_type_id),
    CONSTRAINT fk_appt_slot FOREIGN KEY (slot_id)
        REFERENCES doctor_slots(slot_id)
) ENGINE=InnoDB;

-- =====================================================
-- VISITS
-- =====================================================
CREATE TABLE IF NOT EXISTS visits (
    visit_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    appointment_id BIGINT UNSIGNED UNIQUE NOT NULL,
    diagnosis VARCHAR(200),
    treatment VARCHAR(200),
    prescription VARCHAR(200),
    notes VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_visit_appointment
        FOREIGN KEY (appointment_id)
        REFERENCES appointments(appointment_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- VET LEAVES
-- =====================================================
CREATE TABLE IF NOT EXISTS vet_leaves (
    leave_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vet_id BIGINT UNSIGNED NOT NULL,
    leave_type ENUM('SICK','VACATION','PERSONAL','OTHER') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_leave_vet
        FOREIGN KEY (vet_id) REFERENCES vet_details(vet_id) ON DELETE CASCADE,
    CONSTRAINT chk_leave_dates CHECK (end_date >= start_date)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;