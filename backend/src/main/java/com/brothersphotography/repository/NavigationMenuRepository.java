package com.brothersphotography.repository;

import com.brothersphotography.entity.NavigationMenu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NavigationMenuRepository extends JpaRepository<NavigationMenu, Long> {
    List<NavigationMenu> findByActiveTrueOrderByOrderIndexAsc();
    List<NavigationMenu> findAllByOrderByOrderIndexAsc();
}
