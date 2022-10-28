package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.UCSBDiningCommonsMenuItem;
import edu.ucsb.cs156.example.entities.UCSBDate.UCSBDateBuilder;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.UCSBDiningCommonsMenuItemRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@Api(description = "UCSBDiningCommonsMenuItem")
@RequestMapping("/api/UCSBDiningCommonsMenuItem")
@RestController
@Slf4j
public class UCSBDiningCommonsMenuItemController extends ApiController{
    
    @Autowired
    UCSBDiningCommonsMenuItemRepository ucsbDiningCommonsMenuItemRepository;

    @ApiOperation(value = "List all ucsb dinning commons menu and items")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<UCSBDiningCommonsMenuItem> allMenuItems(){
        Iterable<UCSBDiningCommonsMenuItem> menuitems = ucsbDiningCommonsMenuItemRepository.findAll();
        return menuitems;
    }

    @ApiOperation(value = "Get a single menu for common")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public UCSBDiningCommonsMenuItem getByID(
            @ApiParam("id") @RequestParam long id) {
        UCSBDiningCommonsMenuItem menuitems = ucsbDiningCommonsMenuItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonsMenuItem.class, id));

        return menuitems;
    }

    @ApiOperation(value = "Create a new commons menu")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public UCSBDiningCommonsMenuItem postCommons(
        @ApiParam("id") @RequestParam long id,
        @ApiParam("diningCommonsCode") @RequestParam String diningCommonsCode,
        @ApiParam("name") @RequestParam String name,
        @ApiParam("station") @RequestParam String station
        )
        {
        
        UCSBDiningCommonsMenuItem menuItem = new UCSBDiningCommonsMenuItem();
        menuItem.setId(id);
        menuItem.setDiningCommonsCode(diningCommonsCode);
        menuItem.setName(name);
        menuItem.setStation(station);

        UCSBDiningCommonsMenuItem savedMenu = ucsbDiningCommonsMenuItemRepository.save(menuItem);

        return savedMenu;
    }

    @ApiOperation(value = "Delete a UCSBDiningCommonsMenu")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteCommons(
            @ApiParam("id") @RequestParam long id) {
        UCSBDiningCommonsMenuItem commons = ucsbDiningCommonsMenuItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonsMenuItem.class, id));

        ucsbDiningCommonsMenuItemRepository.delete(commons);
        return genericMessage("UCSBDiningCommonsMenuItem with id %s deleted".formatted(id));
    }

    @ApiOperation(value = "Update a single commons menu")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public UCSBDiningCommonsMenuItem updateCommons(
            @ApiParam("id") @RequestParam long id,
            @RequestBody @Valid UCSBDiningCommonsMenuItem incoming) {

        UCSBDiningCommonsMenuItem commons = ucsbDiningCommonsMenuItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonsMenuItem.class, id));


        commons.setId(incoming.getId());
        commons.setName(incoming.getName());  
        commons.setDiningCommonsCode(incoming.getDiningCommonsCode());
        commons.setStation(incoming.getStation());

        ucsbDiningCommonsMenuItemRepository.save(commons);

        return commons;
    }
}
