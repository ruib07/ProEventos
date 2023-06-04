using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain.Identity;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Application
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IMapper _mapper;
        private readonly IUserPersist _userPersist;

        public AccountService(UserManager<User> userManager, 
        SignInManager<User> signInManager, IMapper mapper, IUserPersist userPersist)
        {
            _userPersist = userPersist;
            _signInManager = signInManager;
            _userManager = userManager;
            _mapper = mapper;
        }
        
        public Task<SignInResult> CheckUserPasswordAsync(UserUpdateDto userUpdateDto, string password)
        {
            throw new NotImplementedException();
        }

        public Task<UserDto> CreateAccountAsync(UserDto userDto)
        {
            throw new NotImplementedException();
        }

        public Task<UserUpdateDto> GetUserByUsernameAsync(string username)
        {
            throw new NotImplementedException();
        }

        public Task<UserUpdateDto> UpdateAccount(UserUpdateDto userUpdateDto)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UserExists(string username)
        {
            throw new NotImplementedException();
        }
    }
}