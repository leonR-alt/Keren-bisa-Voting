package project.voting.controller;

import project.voting.entity.Candidate;
import project.voting.entity.Voter;
import project.voting.service.AdminService;
import project.voting.repository.VoterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.voting.security.JwtTokenService;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.concurrent.atomic.AtomicReference;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    @Autowired private AdminService adminService;
    @Autowired private JwtTokenService jwtTokenService;
    @Autowired private VoterRepository voterRepository;

    // ✅ Email super admin — tidak bisa dihapus/diturunkan oleh siapapun
    private static final String SUPER_ADMIN_EMAIL = "leonarisrumahorbo@gmail.com";

    private static final AtomicReference<Long> votingDeadline = new AtomicReference<>(null);
    private static final AtomicReference<String> electionTitle = new AtomicReference<>("");

    private boolean isAdmin(String token) {
        Voter voter = jwtTokenService.getVoterFromToken(token);
        return voter != null && voter.getIsAdmin();
    }

    private boolean isSuperAdmin(String token) {
        Voter voter = jwtTokenService.getVoterFromToken(token);
        return voter != null && SUPER_ADMIN_EMAIL.equals(voter.getEmail());
    }

    private boolean isSuperAdminEmail(String email) {
        return SUPER_ADMIN_EMAIL.equals(email);
    }

    // ===== DEADLINE + JUDUL =====
    @GetMapping("/deadline")
    public ResponseEntity<Map<String, Object>> getDeadline() {
        Map<String, Object> res = new HashMap<>();
        res.put("deadline", votingDeadline.get());
        res.put("title", electionTitle.get());
        return ResponseEntity.ok(res);
    }

    @PostMapping("/deadline")
    public ResponseEntity<Map<String, Object>> setDeadline(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> body) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtTokenService.validateToken(token) || !isAdmin(token))
            return ResponseEntity.status(403).build();

        Long deadline = body.get("deadline") != null ? ((Number) body.get("deadline")).longValue() : null;
        String title = body.get("title") != null ? body.get("title").toString() : "";

        votingDeadline.set(deadline);
        electionTitle.set(title);

        Map<String, Object> res = new HashMap<>();
        res.put("deadline", deadline);
        res.put("title", title);
        return ResponseEntity.ok(res);
    }

    // ===== VOTER MANAGEMENT =====
    @GetMapping("/voters")
    public ResponseEntity<List<Voter>> getAllVoters(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtTokenService.validateToken(token) || !isAdmin(token))
            return ResponseEntity.status(403).body(null);
        return ResponseEntity.ok(adminService.getAllVoters());
    }

        @GetMapping("/voters/{id}")
    public ResponseEntity<?> getVoter(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer id) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtTokenService.validateToken(token) || !isAdmin(token))
            return ResponseEntity.status(403).build();
        
        return ResponseEntity.ok(voterRepository.findById(id).orElse(null));
    }

    @PutMapping("/voters/{id}")
    public ResponseEntity<?> updateVoter(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer id, @RequestBody Voter updatedVoter) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtTokenService.validateToken(token) || !isAdmin(token))
            return ResponseEntity.status(403).build();

        // Cek target voter — kalau super admin, hanya super admin sendiri yang boleh edit
        Voter targetVoter = voterRepository.findById(id).orElse(null);
        if (targetVoter != null && isSuperAdminEmail(targetVoter.getEmail()) && !isSuperAdmin(token)) {
            return ResponseEntity.status(403).body("Tidak bisa mengubah akun Super Admin.");
        }

        // Tidak boleh turunkan status admin super admin
        if (targetVoter != null && isSuperAdminEmail(targetVoter.getEmail())) {
            updatedVoter.setIsAdmin(true); // paksa tetap admin
        }

        return ResponseEntity.ok(adminService.updateVoter(id, updatedVoter));
    }

    @DeleteMapping("/voters/{id}")
    public ResponseEntity<?> deleteVoter(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer id) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtTokenService.validateToken(token) || !isAdmin(token))
            return ResponseEntity.status(403).build();

        // Super admin tidak bisa dihapus oleh siapapun
        Voter targetVoter = voterRepository.findById(id).orElse(null);
        if (targetVoter != null && isSuperAdminEmail(targetVoter.getEmail())) {
            return ResponseEntity.status(403).body("Tidak bisa menghapus akun Super Admin.");
        }

        adminService.deleteVoter(id);
        return ResponseEntity.ok("Deleted");
    }

    // ===== CANDIDATE MANAGEMENT =====
    @PostMapping("/candidates")
    public ResponseEntity<Candidate> addCandidate(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Candidate candidate) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtTokenService.validateToken(token) || !isAdmin(token))
            return ResponseEntity.status(403).build();
        return ResponseEntity.ok(adminService.addCandidate(candidate));
    }

    @PutMapping("/candidates/{id}")
    public ResponseEntity<Candidate> updateCandidate(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer id, @RequestBody Candidate updatedCandidate) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtTokenService.validateToken(token) || !isAdmin(token))
            return ResponseEntity.status(403).build();
        return ResponseEntity.ok(adminService.updateCandidate(id, updatedCandidate));
    }

    @DeleteMapping("/candidates/{id}")
    public ResponseEntity<String> deleteCandidate(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer id) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtTokenService.validateToken(token) || !isAdmin(token))
            return ResponseEntity.status(403).build();
        adminService.deleteCandidate(id);
        return ResponseEntity.ok("Deleted");
    }

    // ===== RESULTS =====
    @GetMapping("/results")
    public ResponseEntity<List<Candidate>> getResults(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtTokenService.validateToken(token) || !isAdmin(token))
            return ResponseEntity.status(403).body(null);
        return ResponseEntity.ok(adminService.getResults());
    }
}