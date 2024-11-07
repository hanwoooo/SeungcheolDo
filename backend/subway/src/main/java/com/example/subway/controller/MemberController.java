package com.example.subway.controller;

import com.example.subway.dto.MemberDto;
import com.example.subway.entity.MemberEntity;
import com.example.subway.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/member")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @PostMapping("/signUp")
    public ResponseEntity<String> signUp(@RequestBody MemberDto memberDTO) {
        boolean isRegistered = memberService.signUp(memberDTO);
        if (isRegistered) {
            return ResponseEntity.ok("Signup successful");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Signup failed");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(HttpServletRequest request, @RequestBody MemberDto memberDto) {
        MemberDto member = memberService.login(memberDto);

        if (member != null) {
            // 세션 생성
            HttpSession session = request.getSession();
            session.setAttribute("memberEmail", member.getMemberEmail());
            System.out.println("test success");
            return ResponseEntity.ok("Login successful");
        } else {
            System.out.println("test");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed");
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<MemberDto> getProfile(HttpServletRequest request) {
        HttpSession session = request.getSession(false); // 세션이 없으면 null을 반환
        if (session != null && session.getAttribute("memberEmail") != null) {
            String memberEmail = (String) session.getAttribute("memberEmail");
            MemberEntity member = memberService.findByMemberEmail(memberEmail);
            MemberDto memberDto = MemberDto.toMemberDTO(member);
            return ResponseEntity.ok(memberDto);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false); // 기존 세션이 있을 때만 가져옴
        if (session != null) {
            session.invalidate(); // 세션 무효화, 세션에 저장된 모든 데이터 삭제
        }
        return ResponseEntity.ok("Logout successful");
    }
}