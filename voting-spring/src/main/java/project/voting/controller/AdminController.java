package project.voting.controller;

import project.voting.entity.Candidate;
import project.voting.entity.Voter;
import project.voting.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.concurrent.atomic.AtomicReference;

import project.voting.security.JwtTokenService;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private JwtTokenService jwtTokenService;

    // Simpan deadline voting di memory (persisten selama server hidup)
    private static final AtomicReference<Long> votingDeadline = new AtomicReference<>(null);

    private boolean isAdmin(String token) {
        Voter voter = jwtTokenService.getVoterFromToken(token);
        return voter != null && voter.getIsAdmin();
    }

    // ===== DEADLINE VOTING =====
    @GetMapping("/deadline")
    public ResponseEntity<Map<String, Object>> getDeadline() {
        Map<String, Object> res = new HashMap<>();
        res.put("deadline", votingDeadline.get());
        return ResponseEntity.ok(res);
    }

    @PostMapping("/deadline")
    public ResponseEntity<Map<String, Object>> setDeadline(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Long> body) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtTokenService.validateToken(token) || !isAdmin(token)) {
            return ResponseEntity.status(403).build();
        }
        Long deadline = body.get("deadline");
        votingDeadline.set(deadline);
        Map<String, Object> res = new HashMap<>();
        res.put("deadline", deadline);
        res.put("message", "Deadline berhasil diset");
        return ResponseEntity.ok(res);
    }

    // ===== VOTER MANAGEMENT =====
    @GetMapping("/voters")
    public ResponseEntity<List<Voter>> getAllVoters(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtTokenService.validateToken(token) || !isAdmin(token)) {
            return ResponseEntity.status(403).body(null);
        }
        return ResponseEntity.ok(adminService.getAllVoters());
    }

    @PutMapping("/voters/{id}")
    public ResponseEntity<Voter> updateVoter(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer id,
            @RequestBody Voter updatedVoter) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtTokenService.validateToken(token) || !isAdmin(token)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(adminService.updateVoter(id, updatedVoter));
    }

    @DeleteMapping("/voters/{id}")
    public ResponseEntity<String> deleteVoter(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer id) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtTokenService.validateToken(token) || !isAdmin(token)) {
            return ResponseEntity.status(403).build();
        }
        adminService.deleteVoter(id);
        return ResponseEntity.ok("Voter deleted successfully");
    }

    // ===== CANDIDATE MANAGEMENT =====
    @PostMapping("/candidates")
    public ResponseEntity<Candidate> addCandidate(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Candidate candidate) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtTokenService.validateToken(token) || !isAdmin(token)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(adminService.addCandidate(candidate));
    }

    @PutMapping("/candidates/{id}")
    public ResponseEntity<Candidate> updateCandidate(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer id,
            @RequestBody Candidate updatedCandidate) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtTokenService.validateToken(token) || !isAdmin(token)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(adminService.updateCandidate(id, updatedCandidate));
    }

    @DeleteMapping("/candidates/{id}")
    public ResponseEntity<String> deleteCandidate(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer id) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtTokenService.validateToken(token) || !isAdmin(token)) {
            return ResponseEntity.status(403).build();
        }
        adminService.deleteCandidate(id);
        return ResponseEntity.ok("Candidate deleted successfully");
    }

    // ===== RESULTS =====
    @GetMapping("/results")
    public ResponseEntity<List<Candidate>> getResults(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtTokenService.validateToken(token) || !isAdmin(token)) {
            return ResponseEntity.status(403).body(null);
        }
        return ResponseEntity.ok(adminService.getResults());
    }
}