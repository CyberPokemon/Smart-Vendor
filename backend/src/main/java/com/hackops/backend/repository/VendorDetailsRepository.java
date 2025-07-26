package com.hackops.backend.repository;

import com.hackops.backend.model.Users;
import com.hackops.backend.model.VendorDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VendorDetailsRepository extends JpaRepository<VendorDetails,Long> {


    Optional<VendorDetails> findByUser(Users user);
}
