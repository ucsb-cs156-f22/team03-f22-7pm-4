package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.UCSBOrganization;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.UCSBOrganizationRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
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

import java.time.LocalDateTime;

@Api(description = "UCSBOrganizations")
@RequestMapping("/api/ucsborganization")
@RestController
@Slf4j
public class UCSBOrganization extends ApiController {

    @Autowired
    UCSBOrganizationRepository ucsbOrganizationRepository;

    @ApiOperation(value = "List all ucsb organizations")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<UCSBOrganization> allUCSBOrganizations() {
        Iterable<UCSBOrganization> org = ucsbOrganizationRepository.findAll();
        return org;
    }

    @ApiOperation(value = "Get a single organization")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public UCSBOrganization getById(
            @ApiParam("orgCode") @RequestParam String orgCode) {
        UCSBOrganization ucsbOrganization = ucsbOrganizationRepository.findById(orgCode)
                .orElseThrow(() -> new EntityNotFoundException(UCSBOrganization.class, orgCode));

        return ucsbOrganization;
    }

    @ApiOperation(value = "Create a new organization")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public UCSBOrganization postUCSBOrganization(
            @ApiParam("orgCode (organization abbreviation)") @RequestParam String orgCode,
            @ApiParam("orgTranslationShort (organization name for short)") @RequestParam String orgTranslationShort,
            @ApiParam("orgTranslation (full name of organization)") @RequestParam String orgTranslation,
            @ApiParam("inactive (true or false)") @RequestParam boolean inactive)
            {


        UCSBOrganization ucsbOrganization = new UCSBOrganization();
        ucsbOrganization.setOrgCode(orgCode);
        ucsbOrganization.setOrgTranslationShort(orgTranslationShort);
        ucsbOrganization.setOrgTranslation(orgTranslation);
        ucsbOrganization.setInactive(inactive);



        UCSBOrganization savedUcsbOrganization = ucsbOrganizationRepository.save(ucsbOrganization);

        return savedUcsbOrganization;
    }

    @ApiOperation(value = "Delete a UCSBOrganization")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteUCSBOrganization(
            @ApiParam("orgCode") @RequestParam String orgCode) {
        UCSBOrganization ucsbOrg = ucsbOrganizationRepository.findById(orgCode)
                .orElseThrow(() -> new EntityNotFoundException(UCSBOrganization.class, orgCode));

        ucsbDateRepository.delete(ucsbOrg);
        return genericMessage("UCSBOrganization with id %s deleted".formatted(orgCode));
    }

    @ApiOperation(value = "Update a single organization")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public UCSBOrganization updateUCSBOrganization(
            @ApiParam("orgCode") @RequestParam String orgCode,
            @RequestBody @Valid UCSBOrganization incoming) {

        UCSBOrganization ucsbOrg = ucsbOrganizationRepository.findById(orgCode)
                .orElseThrow(() -> new EntityNotFoundException(UCSBOrganization.class, orgCode));

        ucsbOrg.setOrgTranslationShort(incoming.getOrgTranslationShort());
        ucsbOrg.setOrgTranslation(incoming.getOrgTranslation());
        ucsbOrg.setInactive(incoming.getInactive());

        ucsbOrganizationRepository.save(ucsbOrg);

        return ucsbOrg;
    }
}
